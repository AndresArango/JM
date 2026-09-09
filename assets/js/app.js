/**
 * EL LABORATORIO SECRETO — Motor
 * -------------------------------------------------
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

  const xpCanjeada = canjesRows.reduce(
    (sum, r) => sum + (Number(r.XP_Gastado) || 0),
    0
  );

  return { estadoPorId, canjes: canjesRows, xpCanjeada };
}

function estaCompletada(estadoPorId, id) {
  return Boolean(estadoPorId[id] && estadoPorId[id].estado === "Completada");
}

function requisitoCumplido(estadoPorId, requiere) {
  return (requiere || []).every((req) => {
    if (typeof req === "string") return estaCompletada(estadoPorId, req);
    if (req && Array.isArray(req.anyOf)) {
      return req.anyOf.some((id) => estaCompletada(estadoPorId, id));
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

function estadoVisualDeMision(estadoPorId, m, xpTotal) {
  const info = estadoPorId[m.id];
  if (info && info.estado === "Completada") return "completada";
  if (info && info.estado === "Omitida") return "omitida";
  const prereqOk = requisitoCumplido(estadoPorId, m.requiere);
  const xpOk = !m.xpMinima || xpTotal >= m.xpMinima;
  return prereqOk && xpOk ? "disponible" : "bloqueada";
}

function nombreRequisito(requiere) {
  if (!requiere || requiere.length === 0) return null;
  const partes = requiere.map((req) => {
    if (typeof req === "string") return `Misión ${req}`;
    if (req && req.anyOf) return `(Misión ${req.anyOf.join(" o ")})`;
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
  const conseguidas = MISSIONS.filter((m) => estaCompletada(estadoPorId, m.id));

  if (conseguidas.length === 0) {
    cont.appendChild(
      crearElemento("p", "insignias-vacio", "Todavía no hay insignias en la vitrina. ¡La primera está muy cerca!")
    );
    return;
  }

  conseguidas.forEach((m) => {
    const badge = crearElemento("div", "insignia");
    badge.appendChild(crearElemento("span", "insignia-icono", "🔶"));
    badge.appendChild(crearElemento("span", "insignia-nombre", m.insignia));
    cont.appendChild(badge);
  });
}

function tarjetaMision(m, estadoVisual, estadoPorId) {
  const card = crearElemento("article", `mision mision--${estadoVisual}`);

  const encabezado = crearElemento("div", "mision-encabezado");
  encabezado.appendChild(crearElemento("span", "mision-id", `#${m.id}`));
  encabezado.appendChild(crearElemento("span", "mision-tipo", m.tipo));
  card.appendChild(encabezado);

  card.appendChild(crearElemento("h3", "mision-nombre", m.nombre));

  if (estadoVisual === "completada") {
    const info = estadoPorId[m.id];
    card.appendChild(crearElemento("p", "mision-estado-texto", "✅ Superada" + (info && info.fecha ? ` · ${info.fecha}` : "")));
    card.appendChild(crearElemento("p", "mision-detalle", m.descubrimiento));
    card.appendChild(crearElemento("p", "mision-recompensa", `Insignia obtenida: ${m.insignia}`));
  } else if (estadoVisual === "omitida") {
    card.appendChild(crearElemento("p", "mision-estado-texto", "↩️ Ruta no elegida esta vez"));
  } else if (estadoVisual === "disponible") {
    card.appendChild(crearElemento("p", "mision-estado-texto", "🔓 ¡Disponible ahora!"));
    card.appendChild(crearElemento("p", "mision-detalle", m.historia));
    card.appendChild(crearElemento("p", "mision-objetivo", `<strong>Objetivo:</strong> ${m.objetivo}`));
    card.appendChild(crearElemento("p", "mision-pregunta", `<strong>Antes de empezar:</strong> ${m.prediccion}`));
    card.appendChild(crearElemento("p", "mision-equipo", `<strong>Equipo autorizado:</strong> ${m.equipo}`));
    card.appendChild(crearElemento("p", "mision-recompensa", `Recompensa al superarla: +${m.recompensaXP} XP`));
  } else {
    const req = nombreRequisito(m.requiere);
    card.appendChild(crearElemento("p", "mision-estado-texto", "🔒 Bloqueada"));
    card.appendChild(
      crearElemento(
        "p",
        "mision-detalle",
        req ? `Se abre cuando completes: ${req}` : "Todavía no se puede abrir esta puerta."
      )
    );
  }

  return card;
}

function renderMisiones(estadoPorId, xpTotal) {
  const cont = document.getElementById("mapa-misiones");
  cont.innerHTML = "";
  MISSIONS.forEach((m) => {
    const estadoVisual = estadoVisualDeMision(estadoPorId, m, xpTotal);
    cont.appendChild(tarjetaMision(m, estadoVisual, estadoPorId));
  });
}

function renderFinalPreview() {
  const cont = document.getElementById("final-preview");
  cont.innerHTML = "";
  const card = crearElemento("article", "mision mision--final");
  card.appendChild(crearElemento("span", "mision-id", `#${FINAL_PREVIEW.id} · Muy al final del laboratorio`));
  card.appendChild(crearElemento("h3", "mision-nombre", FINAL_PREVIEW.nombre));
  card.appendChild(crearElemento("p", "mision-detalle", FINAL_PREVIEW.teaser));
  card.appendChild(crearElemento("p", "mision-recompensa", `Recompensa final: +${FINAL_PREVIEW.recompensaXP} XP · Insignia ${FINAL_PREVIEW.insignia}`));
  cont.appendChild(card);
}

function renderError(mensaje) {
  const cont = document.getElementById("mapa-misiones");
  cont.innerHTML = "";
  cont.appendChild(
    crearElemento(
      "p",
      "estado-error",
      `⚠️ El laboratorio no pudo leer su registro (${mensaje}). Pídele al supervisor que revise el archivo data/estado.xlsx.`
    )
  );
}

async function iniciar() {
  try {
    const { estadoPorId, xpCanjeada } = await cargarEstado();
    const { xpTotal, xpDisponible } = calcularProgreso(estadoPorId, xpCanjeada);
    const completadas = MISSIONS.filter((m) => estaCompletada(estadoPorId, m.id)).length;

    renderCabecera(xpTotal, xpDisponible, completadas, MISSIONS.length);
    renderInsignias(estadoPorId);
    renderMisiones(estadoPorId, xpTotal);
    renderFinalPreview();
  } catch (err) {
    console.error(err);
    renderError(err.message);
  }
}

document.getElementById("btn-recargar").addEventListener("click", iniciar);
iniciar();
