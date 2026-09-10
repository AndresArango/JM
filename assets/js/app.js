/**
 * EL LABORATORIO SECRETO — Motor
 * -------------------------------------------------------------------------
 * Esta página NUNCA escribe en el Excel ni decide por sí sola que una
 * misión está completada. Solo LEE data/estado.xlsx y dibuja lo que
 * corresponde. La única forma de avanzar es que el archivo cambie
 * (y eso solo lo hace el supervisor, subiendo un nuevo estado.xlsx).
 */

const DATA_URL = "data/estado.xlsx?_=" + Date.now(); // evita caché del navegador

async function cargarEstado() {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("No se encontró data/estado.xlsx");
  const buf = await res.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });

  const misionesSheet = wb.Sheets["Misiones"];
  const canjesSheet = wb.Sheets["Canjes"];
  if (!misionesSheet) throw new Error('El Excel no tiene una hoja llamada "Misiones"');

  const misionesRows = XLSX.utils.sheet_to_json(misionesSheet, { defval: "" });
  const canjesRows = canjesSheet
    ? XLSX.utils.sheet_to_json(canjesSheet, { defval: "" })
    : [];

  const estadoPorId = {};
  misionesRows.forEach((row) => {
    if (row.ID === "" || row.ID === undefined) return;
    const id = String(row.ID).trim().padStart(2, "0");
    estadoPorId[id] = {
      estado: String(row.Estado || "Pendiente").trim(),
      fecha: row.Fecha_Aprobacion || "",
    };
  });

  // Solo cuentan como "canje real" las filas con Fecha (evita contar filas de ejemplo vacías)
  const canjes = canjesRows.filter((r) => r.Fecha || r.Tipo || r.Descripcion);
  const xpCanjeada = canjes.reduce((sum, r) => sum + (Number(r.XP_Gastado) || 0), 0);

  return { estadoPorId, canjes, xpCanjeada };
}

function estaCompletada(estadoPorId, id) {
  return Boolean(estadoPorId[id] && estadoPorId[id].estado === "Completada");
}

// Evalúa un requisito (o una lista de requisitos, todos deben cumplirse)
function requisitoCumplido(estadoPorId, canjes, requiere) {
  return (requiere || []).every((req) => {
    if (typeof req === "string") {
      return estaCompletada(estadoPorId, req);
    }
    if (req && Array.isArray(req.anyOf)) {
      return req.anyOf.some((id) => estaCompletada(estadoPorId, id));
    }
    if (req && typeof req.countAtLeast === "number" && Array.isArray(req.ids)) {
      const completadas = req.ids.filter((id) => estaCompletada(estadoPorId, id)).length;
      return completadas >= req.countAtLeast;
    }
    if (req && req.canjeTipo) {
      if (req.canjeTipo === "cualquiera") return canjes.length > 0;
      return canjes.some((c) => String(c.Tipo || "").trim() === req.canjeTipo);
    }
    return true;
  });
}

function calcularProgreso(estadoPorId, xpCanjeada) {
  let xpTotal = 0;
  let xpGastadaEnDesbloqueos = 0;

  MISSIONS.forEach((m) => {
    if (estaCompletada(estadoPorId, m.id)) {
      xpTotal += m.recompensaXP || 0;
      xpGastadaEnDesbloqueos += m.costoXP || 0;
    }
  });

  const xpDisponible = xpTotal - xpGastadaEnDesbloqueos - xpCanjeada;
  return { xpTotal, xpDisponible: Math.max(0, xpDisponible) };
}

function estadoVisualDeMision(estadoPorId, canjes, m) {
  const info = estadoPorId[m.id];
  if (info && info.estado === "Completada") return "completada";
  if (info && info.estado === "Omitida") return "omitida";
  return requisitoCumplido(estadoPorId, canjes, m.requiere) ? "disponible" : "bloqueada";
}

function nombreRequisito(requiere) {
  if (!requiere || requiere.length === 0) return null;
  const partes = requiere.map((req) => {
    if (typeof req === "string") return `Misión ${req}`;
    if (req && req.anyOf) return `(Misión ${req.anyOf.join(" o ")})`;
    if (req && typeof req.countAtLeast === "number") return `al menos ${req.countAtLeast} misiones de un grupo`;
    if (req && req.canjeTipo) return req.canjeTipo === "cualquiera" ? "haber usado un canje" : `un canje de tipo ${req.canjeTipo}`;
    return "";
  });
  return partes.join(" y ");
}

function crearElemento(tag, className, contenido) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (contenido !== undefined) el.innerHTML = contenido;
  return el;
}

function renderCabecera(xpTotal, xpDisponible, completadas, totalMisiones) {
  const cabecera = document.getElementById("cabecera-xp");
  cabecera.innerHTML = "";
  const bloque = (valor, etiqueta) => {
    const c = crearElemento("div", "xp-bloque");
    c.appendChild(crearElemento("span", "xp-valor", String(valor)));
    c.appendChild(crearElemento("span", "xp-etiqueta", etiqueta));
    return c;
  };
  cabecera.appendChild(bloque(xpTotal, "XP total"));
  cabecera.appendChild(bloque(xpDisponible, "XP disponible"));
  cabecera.appendChild(bloque(`${completadas}/${totalMisiones}`, "Misiones superadas"));
}

function renderInsignias(estadoPorId) {
  const cont = document.getElementById("insignias");
  cont.innerHTML = "";
  const conseguidas = MISSIONS.filter((m) => estaCompletada(estadoPorId, m.id) && m.insignia);

  if (conseguidas.length === 0) {
    cont.appendChild(crearElemento("p", "insignias-vacio", "Todavía no hay insignias en la vitrina. ¡La primera está muy cerca!"));
    return;
  }
  conseguidas.forEach((m) => {
    const badge = crearElemento("div", "insignia");
    badge.appendChild(crearElemento("span", "insignia-icono", "🔶"));
    badge.appendChild(crearElemento("span", "insignia-nombre", m.insignia));
    cont.appendChild(badge);
  });
}

function iconoTipo(tipo) {
  const iconos = {
    Bonus: "🎁", Secreta: "🗝️", Especial: "⚙️",
    "Final": "🏆", "Final secreto": "✨",
    "Ruta A": "🔀", "Ruta B": "🔀",
  };
  return iconos[tipo] || "🔧";
}

function tarjetaMision(m, estadoVisual, estadoPorId) {
  const card = crearElemento("article", `mision mision--${estadoVisual} mision--tipo-${m.tipo.replace(/\s+/g, "-")}`);
  card.id = `mision-${m.id}`;

  const encabezado = crearElemento("div", "mision-encabezado");
  encabezado.appendChild(crearElemento("span", "mision-id", `${iconoTipo(m.tipo)} #${m.id}`));
  encabezado.appendChild(crearElemento("span", "mision-tipo", m.tipo));
  card.appendChild(encabezado);

  card.appendChild(crearElemento("h3", "mision-nombre", m.nombre));

  if (estadoVisual === "completada") {
    const info = estadoPorId[m.id];
    card.appendChild(crearElemento("p", "mision-estado-texto", "✅ Superada" + (info && info.fecha ? ` · ${info.fecha}` : "")));
    card.appendChild(crearElemento("p", "mision-detalle", m.descubrimiento || "¡Buen trabajo, ingeniero!"));
    if (m.elementoAdquiere) card.appendChild(crearElemento("p", "mision-recompensa", `Obtuviste: ${m.elementoAdquiere}`));
  } else if (estadoVisual === "omitida") {
    card.appendChild(crearElemento("p", "mision-estado-texto", "↩️ Ruta no elegida esta vez"));
  } else if (estadoVisual === "disponible") {
    card.appendChild(crearElemento("p", "mision-estado-texto", "🔓 ¡Disponible ahora!"));
    card.appendChild(crearElemento("p", "mision-detalle", m.historia || "Esta aventura todavía se está escribiendo — pronto tendrá su historia completa."));
    if (m.objetivo) card.appendChild(crearElemento("p", "mision-objetivo", `<strong>Objetivo:</strong> ${m.objetivo}`));
    if (m.prediccion) card.appendChild(crearElemento("p", "mision-pregunta", `<strong>Antes de empezar:</strong> ${m.prediccion}`));
    if (m.equipo) card.appendChild(crearElemento("p", "mision-equipo", `<strong>Equipo autorizado:</strong> ${m.equipo}`));
    card.appendChild(crearElemento("p", "mision-recompensa", `Recompensa: +${m.recompensaXP} XP${m.elementoAdquiere ? " · " + m.elementoAdquiere : ""}`));
  } else {
    const req = nombreRequisito(m.requiere);
    card.appendChild(crearElemento("p", "mision-estado-texto", "🔒 Bloqueada"));
    card.appendChild(crearElemento("p", "mision-detalle", req ? `Se abre cuando completes: ${req}` : "Todavía no se puede abrir esta puerta."));
  }
  return card;
}

function renderMisiones(estadoPorId, canjes) {
  const cont = document.getElementById("mapa-misiones");
  cont.innerHTML = "";
  MISSIONS.forEach((m) => {
    const estadoVisual = estadoVisualDeMision(estadoPorId, canjes, m);
    cont.appendChild(tarjetaMision(m, estadoVisual, estadoPorId));
  });
}

function renderError(mensaje) {
  const cont = document.getElementById("mapa-misiones");
  cont.innerHTML = "";
  cont.appendChild(crearElemento("p", "estado-error", `⚠️ El laboratorio no pudo leer su registro (${mensaje}). Pídele al supervisor que revise el archivo data/estado.xlsx.`));
}

async function iniciar() {
  try {
    const { estadoPorId, canjes, xpCanjeada } = await cargarEstado();
    const { xpTotal, xpDisponible } = calcularProgreso(estadoPorId, xpCanjeada);
    const completadas = MISSIONS.filter((m) => estaCompletada(estadoPorId, m.id)).length;

    renderCabecera(xpTotal, xpDisponible, completadas, MISSIONS.length);
    renderInsignias(estadoPorId);
    renderMisiones(estadoPorId, canjes);

    if (typeof renderMapaRecorrido === "function") {
      renderMapaRecorrido(estadoPorId, canjes);
    }
  } catch (err) {
    console.error(err);
    renderError(err.message);
  }
}

document.getElementById("btn-recargar").addEventListener("click", iniciar);
iniciar();
