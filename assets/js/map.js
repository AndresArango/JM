/**
 * EL LABORATORIO SECRETO — Mapa de recorrido
 * -------------------------------------------------------------------------
 * Dibuja un mapa tipo "camino de juego de mesa": las misiones principales,
 * retos, especiales y rutas forman el sendero central; los bonus y la
 * misión secreta cuelgan como cofres a los lados. Se alimenta 100% del
 * mismo estado que ya calculó app.js — este archivo no vuelve a leer el
 * Excel, solo dibuja.
 */

const MAPA_CONFIG = {
  stepH: 92,
  centerX: 290,
  amplitude: 100,
  forkOffset: 95,
  topPad: 50,
  satelliteDx: 170,
  nodeR: 15,
};

function construirPasosPrincipales() {
  const principales = MISSIONS.filter((m) => m.tipo !== "Bonus" && m.tipo !== "Secreta");
  const pasos = [];
  for (let i = 0; i < principales.length; i++) {
    const m = principales[i];
    const siguiente = principales[i + 1];
    if (m.rutaGrupo && siguiente && siguiente.rutaGrupo === m.rutaGrupo) {
      pasos.push([m, siguiente]);
      i++;
    } else {
      pasos.push([m]);
    }
  }
  return pasos;
}

function construirSatelites() {
  return MISSIONS.filter((m) => m.tipo === "Bonus" || m.tipo === "Secreta").map((m) => {
    const anclaje = m.mapaAnclaje || (typeof m.requiere[0] === "string" ? m.requiere[0] : null);
    return { mision: m, anclaje };
  });
}

function calcularPosiciones(pasos, satelites) {
  const { stepH, centerX, amplitude, forkOffset, topPad, satelliteDx } = MAPA_CONFIG;
  const pos = {};

  pasos.forEach((paso, i) => {
    const y = topPad + i * stepH;
    if (paso.length === 2) {
      pos[paso[0].id] = { x: centerX - forkOffset, y };
      pos[paso[1].id] = { x: centerX + forkOffset, y };
    } else {
      const x = centerX + amplitude * Math.sin(i * 0.65);
      pos[paso[0].id] = { x, y };
    }
  });

  satelites.forEach((s, i) => {
    const ancla = pos[s.anclaje];
    if (!ancla) return;
    const lado = i % 2 === 0 ? 1 : -1;
    pos[s.mision.id] = { x: ancla.x + satelliteDx * lado, y: ancla.y, ancla };
  });

  const alturaTotal = topPad * 2 + pasos.length * stepH;
  return { pos, alturaTotal };
}

function colorPorEstado(estadoVisual) {
  if (estadoVisual === "completada") return "var(--musgo)";
  if (estadoVisual === "disponible") return "var(--redstone-brillo)";
  if (estadoVisual === "omitida") return "var(--hueso-tenue)";
  return "var(--linea)";
}

function construirSVG(estadoPorId, canjes) {
  const pasos = construirPasosPrincipales();
  const satelites = construirSatelites();
  const { pos, alturaTotal } = calcularPosiciones(pasos, satelites);
  const anchoTotal = MAPA_CONFIG.centerX + MAPA_CONFIG.amplitude + MAPA_CONFIG.forkOffset + MAPA_CONFIG.satelliteDx + 60;

  let lineas = "";
  for (let i = 0; i < pasos.length - 1; i++) {
    const actuales = pasos[i];
    const siguientes = pasos[i + 1];
    actuales.forEach((mPrev) => {
      siguientes.forEach((mNext) => {
        const a = pos[mPrev.id];
        const b = pos[mNext.id];
        const estadoNext = estadoVisualDeMision(estadoPorId, canjes, mNext);
        const estadoPrev = estadoVisualDeMision(estadoPorId, canjes, mPrev);
        let clase = "camino-pendiente";
        if (estadoPrev === "completada" && estadoNext === "completada") clase = "camino-recorrido";
        else if (estadoPrev === "completada" && estadoNext === "disponible") clase = "camino-siguiente";
        else if (estadoPrev === "omitida" || estadoNext === "omitida") clase = "camino-omitido";
        // pista de cobre: una línea base (aislante oscuro) + una más fina encima (el cobre)
        lineas += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="camino-base" />`;
        lineas += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="${clase}" />`;
      });
    });
  }

  let conectoresSatelite = "";
  satelites.forEach((s) => {
    const p = pos[s.mision.id];
    if (!p || !p.ancla) return;
    conectoresSatelite += `<line x1="${p.ancla.x}" y1="${p.ancla.y}" x2="${p.x}" y2="${p.y}" class="camino-satelite-base" />`;
    conectoresSatelite += `<line x1="${p.ancla.x}" y1="${p.ancla.y}" x2="${p.x}" y2="${p.y}" class="camino-satelite" />`;
  });

  let nodosPrincipales = "";
  pasos.forEach((paso) => {
    paso.forEach((m) => {
      const p = pos[m.id];
      const estadoVisual = estadoVisualDeMision(estadoPorId, canjes, m);
      const color = colorPorEstado(estadoVisual);
      const relleno = estadoVisual === "bloqueada" ? "var(--piedra-panel)" : color;
      const etiqueta = estadoVisual === "bloqueada" ? "?" : m.id;
      nodosPrincipales += `
        <g class="nodo-mapa nodo-mapa--${estadoVisual}" data-mid="${m.id}" transform="translate(${p.x},${p.y})">
          <title>#${m.id} · ${estadoVisual === "bloqueada" ? "Bloqueada" : m.nombre}</title>
          <rect x="-11" y="-11" width="22" height="22" rx="2" class="nodo-pad" />
          <circle r="${MAPA_CONFIG.nodeR}" fill="${relleno}" stroke="${color}" stroke-width="3" />
          <text text-anchor="middle" dy="4" class="nodo-mapa-texto">${etiqueta}</text>
        </g>`;
    });
  });

  let nodosSatelite = "";
  satelites.forEach((s) => {
    const p = pos[s.mision.id];
    if (!p) return;
    const estadoVisual = estadoVisualDeMision(estadoPorId, canjes, s.mision);
    const color = colorPorEstado(estadoVisual);
    const relleno = estadoVisual === "bloqueada" ? "var(--piedra-panel)" : "var(--cobre)";
    nodosSatelite += `
      <g class="nodo-mapa nodo-mapa--cofre nodo-mapa--${estadoVisual}" data-mid="${s.mision.id}" transform="translate(${p.x},${p.y})">
        <title>${s.mision.tipo} · ${estadoVisual === "bloqueada" ? "Bloqueada" : s.mision.nombre}</title>
        <rect x="-10" y="-6" width="20" height="14" rx="1" fill="${relleno}" stroke="${color}" stroke-width="2" />
        <rect x="-10" y="-10" width="20" height="6" rx="1" fill="${relleno}" stroke="${color}" stroke-width="2" />
        <circle cx="0" cy="1" r="1.6" fill="${color}" />
      </g>`;
  });

  const patron = `
    <defs>
      <pattern id="pxBlocks" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill="var(--piedra-panel)" />
        <rect x="0" y="0" width="10" height="10" fill="var(--piedra-panel-alta)" stroke="var(--piedra-fondo)" stroke-width="0.5" />
        <rect x="10" y="0" width="10" height="10" fill="var(--piedra-panel)" stroke="var(--piedra-fondo)" stroke-width="0.5" />
        <rect x="20" y="0" width="10" height="10" fill="var(--piedra-panel-alta)" stroke="var(--piedra-fondo)" stroke-width="0.5" />
        <rect x="30" y="0" width="10" height="10" fill="var(--musgo)" opacity="0.18" stroke="var(--piedra-fondo)" stroke-width="0.5" />
        <rect x="0" y="10" width="10" height="10" fill="var(--piedra-panel)" stroke="var(--piedra-fondo)" stroke-width="0.5" />
        <rect x="10" y="10" width="10" height="10" fill="var(--piedra-panel-alta)" stroke="var(--piedra-fondo)" stroke-width="0.5" />
        <rect x="20" y="10" width="10" height="10" fill="var(--piedra-panel)" stroke="var(--piedra-fondo)" stroke-width="0.5" />
        <rect x="30" y="10" width="10" height="10" fill="var(--piedra-panel-alta)" stroke="var(--piedra-fondo)" stroke-width="0.5" />
        <rect x="0" y="20" width="10" height="10" fill="var(--piedra-panel-alta)" stroke="var(--piedra-fondo)" stroke-width="0.5" />
        <rect x="10" y="20" width="10" height="10" fill="var(--musgo)" opacity="0.18" stroke="var(--piedra-fondo)" stroke-width="0.5" />
        <rect x="20" y="20" width="10" height="10" fill="var(--piedra-panel-alta)" stroke="var(--piedra-fondo)" stroke-width="0.5" />
        <rect x="30" y="20" width="10" height="10" fill="var(--piedra-panel)" stroke="var(--piedra-fondo)" stroke-width="0.5" />
        <rect x="0" y="30" width="10" height="10" fill="var(--piedra-panel)" stroke="var(--piedra-fondo)" stroke-width="0.5" />
        <rect x="10" y="30" width="10" height="10" fill="var(--piedra-panel-alta)" stroke="var(--piedra-fondo)" stroke-width="0.5" />
        <rect x="20" y="30" width="10" height="10" fill="var(--piedra-panel)" stroke="var(--piedra-fondo)" stroke-width="0.5" />
        <rect x="30" y="30" width="10" height="10" fill="var(--piedra-panel-alta)" stroke="var(--piedra-fondo)" stroke-width="0.5" />
      </pattern>
    </defs>`;

  return {
    svg: `<svg viewBox="0 0 ${anchoTotal} ${alturaTotal}" width="${anchoTotal}" height="${alturaTotal}" xmlns="http://www.w3.org/2000/svg">
      ${patron}
      <rect x="0" y="0" width="${anchoTotal}" height="${alturaTotal}" fill="url(#pxBlocks)" />
      <g class="mapa-caminos">${lineas}${conectoresSatelite}</g>
      <g class="mapa-nodos">${nodosPrincipales}${nodosSatelite}</g>
    </svg>`,
    pasos,
    pos,
  };
}

function renderMapaRecorrido(estadoPorId, canjes) {
  const wrap = document.getElementById("mapa-recorrido-svg");
  if (!wrap) return;

  const { svg, pasos, pos } = construirSVG(estadoPorId, canjes);
  wrap.innerHTML = svg;

  // clic en un nodo -> baja hasta la tarjeta de esa misión en el mapa normal
  wrap.querySelectorAll("[data-mid]").forEach((nodo) => {
    nodo.style.cursor = "pointer";
    nodo.addEventListener("click", () => {
      const tarjeta = document.getElementById(`mision-${nodo.dataset.mid}`);
      if (tarjeta) tarjeta.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  // auto-scroll del panel hasta la primera misión "disponible" (donde va ahora)
  const primeraDisponible = pasos
    .flat()
    .find((m) => estadoVisualDeMision(estadoPorId, canjes, m) === "disponible");
  if (primeraDisponible) {
    const p = pos[primeraDisponible.id];
    const cont = document.getElementById("mapa-recorrido-scroll");
    if (cont && p) {
      cont.scrollTop = Math.max(0, p.y - cont.clientHeight / 2);
    }
  }
}
