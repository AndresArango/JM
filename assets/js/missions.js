/**
 * EL LABORATORIO SECRETO — Contenido y estructura de misiones (47)
 * -------------------------------------------------------------------------
 * Este archivo vive en el repositorio, NO en el Excel. Aquí está todo lo
 * que no cambia solo: nombre, fase, tipo, costo/recompensa de XP, qué
 * elemento se adquiere, y de qué depende cada misión (requiere).
 *
 * Lo único que cambia en el día a día (si ya está completada, la fecha,
 * y los canjes) vive en data/estado.xlsx — ver app.js.
 *
 * TIPOS DE "requiere" soportados por el motor:
 *   "05"                              -> exige la misión 05 completada
 *   { anyOf: ["06","07"] }            -> exige 06 O 07 (bifurcación)
 *   { countAtLeast: 2, ids: [...] }   -> exige al menos 2 completadas de esa lista
 *   { canjeTipo: "cualquiera" }       -> exige al menos un canje registrado (de cualquier tipo)
 *
 * SOLO 01, 02, 06 y 07 tienen la aventura completa escrita todavía. El
 * resto tiene la ficha (nombre, XP, requisitos) lista, y el motor muestra
 * un texto de "contenido en preparación" mientras se van escribiendo.
 */

const MISSIONS = [
  // ---------------------------------------------------------------- FASE 1
  {
    id: "01", nombre: "La puerta secreta", fase: 1, tipo: "Principal",
    costoXP: 0, recompensaXP: 20, insignia: "Domador de Electrones",
    elementoAdquiere: "Insignia Domador de Electrones",
    requiere: [],
    historia: "El laboratorio está oscuro. Sobre una mesa encuentras una pequeña computadora, una placa llena de agujeros y una luz diminuta. Una nota dice: \u201cIngeniero Juan Martín: si consigues despertar esta luz, la primera puerta se abrirá.\u201d",
    objetivo: "Construir tu primer circuito con el ESP32, un LED y una resistencia.",
    prediccion: "¿Qué crees que necesita una luz para encenderse? ¿Basta con poner dos cables en cualquier lugar?",
    equipo: "ESP32 · protoboard · 1 LED · 1 resistencia apropiada · cables Dupont · cable USB",
    descubrimiento: "Un circuito necesita un camino eléctrico completo. La resistencia protege al LED limitando la corriente.",
    desbloquea: "Misión 02 — La luz que despierta",
  },
  {
    id: "02", nombre: "La luz que despierta", fase: 1, tipo: "Principal",
    costoXP: 15, recompensaXP: 20, insignia: "Guardián del Tiempo",
    requiere: ["01"],
    historia: "La primera luz sigue encendida, pero está quieta. El laboratorio susurra: \u201cUna luz que no cambia nunca... no cuenta nada.\u201d Algo en el código puede hacer que aparezca y desaparezca sola.",
    objetivo: "Hacer que el mismo LED se encienda y se apague solo, en un patrón que tú decidas.",
    prediccion: "¿Qué pasará si le pides al programa que espere entre un encendido y otro?",
    equipo: "ESP32 · protoboard · 1 LED · 1 resistencia apropiada · cables Dupont",
    descubrimiento: "Un programa puede repetir instrucciones controlando el tiempo entre pasos: así nace el primer patrón.",
    desbloquea: "Misión 03 — El mapa de los electrones",
  },
  { id: "03", nombre: "El mapa de los electrones", fase: 1, tipo: "Exploración", costoXP: 15, recompensaXP: 15, requiere: ["02"] },
  { id: "04", nombre: "El primer parpadeo", fase: 1, tipo: "Principal", costoXP: 15, recompensaXP: 20, requiere: ["03"] },
  { id: "05", nombre: "Tres colores", fase: 1, tipo: "Principal", costoXP: 15, recompensaXP: 20, elementoAdquiere: "Set LED rojo/amarillo/verde", requiere: ["04"] },
  {
    id: "06", nombre: "El botón mágico", fase: 1, tipo: "Ruta A", rutaGrupo: "fork-1",
    costoXP: 20, recompensaXP: 25, insignia: "Maestro del Clic", elementoAdquiere: "Botones",
    requiere: ["05"],
    historia: "Junto al LED aparece un botón nuevo, todavía sin cables. El laboratorio pregunta: \u201c¿Puedes hacer que algo dependa de una decisión, en vez de repetirse solo?\u201d",
    objetivo: "Conectar un botón que controle el LED según su estado.",
    prediccion: "¿Qué pasará si sueltas el botón? ¿Y si lo dejas presionado mucho tiempo?",
    equipo: "ESP32 · protoboard · 1 botón · 1 LED · resistencias apropiadas · cables Dupont",
    descubrimiento: "Una entrada digital solo tiene dos estados: presionado o no presionado. De ahí nace toda decisión electrónica.",
    desbloquea: "Misión 08 — El código secreto",
  },
  {
    id: "07", nombre: "Los colores del laboratorio", fase: 1, tipo: "Ruta B", rutaGrupo: "fork-1",
    costoXP: 20, recompensaXP: 25, insignia: "Pintor de Luz", elementoAdquiere: "LED RGB (1 de 2)",
    requiere: ["05"],
    historia: "En vez de un botón, el laboratorio te entrega un LED distinto: uno que puede mostrar muchos colores a la vez. \u201cRedstone tiene un color. Este laboratorio tiene todos\u201d, dice la nota.",
    objetivo: "Hacer que un LED RGB cambie de color siguiendo una secuencia que tú diseñes.",
    prediccion: "¿Cómo crees que un solo LED puede mostrar varios colores?",
    equipo: "ESP32 · protoboard · 1 LED RGB · resistencias apropiadas · cables Dupont",
    descubrimiento: "Mezclando distintas intensidades de rojo, verde y azul se puede crear casi cualquier color.",
    desbloquea: "Misión 08 — El código secreto",
  },
  { id: "08", nombre: "El código secreto", fase: 1, tipo: "Principal", costoXP: 20, recompensaXP: 25, requiere: [{ anyOf: ["06", "07"] }] },
  { id: "09", nombre: "La resistencia invisible", fase: 1, tipo: "Bonus", costoXP: 0, recompensaXP: 15, elementoAdquiere: "+10 bloques magnéticos", requiere: ["03"] },
  { id: "10", nombre: "Dos luces, una misión", fase: 1, tipo: "Principal", costoXP: 20, recompensaXP: 25, requiere: ["08"] },

  // ---------------------------------------------------------------- FASE 2
  { id: "11", nombre: "El semáforo secreto", fase: 2, tipo: "Principal", costoXP: 20, recompensaXP: 25, requiere: ["10"] },
  { id: "12", nombre: "El botón maestro", fase: 2, tipo: "Principal", costoXP: 20, recompensaXP: 25, requiere: ["11"] },
  { id: "13", nombre: "El potenciómetro mágico", fase: 2, tipo: "Principal", costoXP: 20, recompensaXP: 25, elementoAdquiere: "Potenciómetro", requiere: ["12"] },
  { id: "14", nombre: "Controla la intensidad", fase: 2, tipo: "Reto", costoXP: 20, recompensaXP: 30, requiere: ["13"] },
  { id: "15", nombre: "La alarma del laboratorio", fase: 2, tipo: "Principal", costoXP: 20, recompensaXP: 25, elementoAdquiere: "Buzzer pasivo", requiere: ["14"] },
  { id: "16", nombre: "El sonido que avisa", fase: 2, tipo: "Principal", costoXP: 25, recompensaXP: 30, elementoAdquiere: "Buzzer activo", requiere: ["15"] },
  { id: "17", nombre: "El relé misterioso", fase: 2, tipo: "Principal", costoXP: 25, recompensaXP: 30, elementoAdquiere: "Relé 1 canal", requiere: ["16"] },
  { id: "18", nombre: "El código de colores", fase: 2, tipo: "Bonus", costoXP: 0, recompensaXP: 15, elementoAdquiere: "+10 bloques magnéticos", requiere: ["13"] },
  { id: "19", nombre: "La feria de luces", fase: 2, tipo: "Reto", costoXP: 25, recompensaXP: 35, requiere: ["17"] },

  // ---------------------------------------------------------------- FASE 3
  { id: "20", nombre: "El laboratorio tiene fiebre", fase: 3, tipo: "Principal", costoXP: 25, recompensaXP: 30, elementoAdquiere: "Sensor DHT11 (temperatura)", requiere: ["19"] },
  { id: "21", nombre: "¿Qué tan húmedo está?", fase: 3, tipo: "Principal", costoXP: 25, recompensaXP: 30, elementoAdquiere: "DHT11 (humedad)", requiere: ["20"] },
  { id: "22", nombre: "El sensor que ve", fase: 3, tipo: "Principal", costoXP: 25, recompensaXP: 30, elementoAdquiere: "Fotoresistencia", requiere: ["21"] },
  { id: "23", nombre: "La luz fantasma", fase: 3, tipo: "Reto", costoXP: 25, recompensaXP: 35, requiere: ["22"] },
  { id: "24", nombre: "El detector de obstáculos", fase: 3, tipo: "Principal", costoXP: 25, recompensaXP: 30, elementoAdquiere: "Módulo IR obstáculos", requiere: ["23"] },
  { id: "25", nombre: "¿Hay alguien ahí?", fase: 3, tipo: "Ruta A", rutaGrupo: "fork-2", costoXP: 30, recompensaXP: 35, elementoAdquiere: "Sensor PIR", requiere: ["24"] },
  { id: "26", nombre: "El oído electrónico", fase: 3, tipo: "Ruta B", rutaGrupo: "fork-2", costoXP: 30, recompensaXP: 35, elementoAdquiere: "Patrones de buzzer", requiere: ["24"] },
  { id: "27", nombre: "La pantalla secreta", fase: 3, tipo: "Principal", costoXP: 30, recompensaXP: 35, elementoAdquiere: "Pantalla OLED", requiere: [{ anyOf: ["25", "26"] }] },
  { id: "28", nombre: "El laboratorio habla", fase: 3, tipo: "Reto", costoXP: 30, recompensaXP: 35, requiere: ["27"] },
  { id: "29", nombre: "El mapa de sensores", fase: 3, tipo: "Bonus", costoXP: 0, recompensaXP: 20, elementoAdquiere: "+15 bloques magnéticos", mapaAnclaje: "24", requiere: [{ countAtLeast: 2, ids: ["20", "22", "24", "25", "26"] }] },
  { id: "30", nombre: "El código secreto del sensor", fase: 3, tipo: "Bonus", costoXP: 0, recompensaXP: 20, elementoAdquiere: "Acceso anticipado a 1 sensor de Fase 4", mapaAnclaje: "27", requiere: [{ canjeTipo: "cualquiera" }] },

  // ---------------------------------------------------------------- FASE 4
  { id: "31", nombre: "El guardián de temperatura", fase: 4, tipo: "Principal", costoXP: 30, recompensaXP: 35, requiere: ["28"] },
  { id: "32", nombre: "La máquina de decisiones", fase: 4, tipo: "Principal", costoXP: 30, recompensaXP: 35, requiere: ["31"] },
  { id: "33", nombre: "Si pasa esto...", fase: 4, tipo: "Principal", costoXP: 30, recompensaXP: 35, requiere: ["32"] },
  { id: "34", nombre: "La puerta secreta 2.0", fase: 4, tipo: "Ruta A", rutaGrupo: "fork-3", costoXP: 30, recompensaXP: 35, requiere: ["33"] },
  { id: "35", nombre: "Alarma de intrusos", fase: 4, tipo: "Ruta B", rutaGrupo: "fork-3", costoXP: 30, recompensaXP: 35, requiere: ["33"] },
  { id: "36", nombre: "El detector de luz", fase: 4, tipo: "Principal", costoXP: 30, recompensaXP: 35, requiere: [{ anyOf: ["34", "35"] }] },
  { id: "37", nombre: "El motor cobra vida", fase: 4, tipo: "Especial", costoXP: 40, recompensaXP: 45, elementoAdquiere: "Motor + hélice", requiere: ["36"] },
  { id: "38", nombre: "La máquina automática", fase: 4, tipo: "Principal", costoXP: 30, recompensaXP: 35, requiere: ["37"] },
  { id: "39", nombre: "El circuito misterioso", fase: 4, tipo: "Reto", costoXP: 35, recompensaXP: 40, requiere: ["38"] },
  { id: "40", nombre: "La fábrica de piezas", fase: 4, tipo: "Bonus", costoXP: 0, recompensaXP: 20, elementoAdquiere: "+20 bloques magnéticos", requiere: ["37"] },

  // ---------------------------------------------------------------- FASE 5
  { id: "41", nombre: "El reto de los tres componentes", fase: 5, tipo: "Reto", costoXP: 35, recompensaXP: 40, requiere: ["39"] },
  { id: "42", nombre: "La máquina de reacción", fase: 5, tipo: "Reto", costoXP: 35, recompensaXP: 40, requiere: ["41"] },
  { id: "43", nombre: "El desafío de los sensores", fase: 5, tipo: "Reto", costoXP: 35, recompensaXP: 40, requiere: ["42"] },
  { id: "44", nombre: "La máquina inútil", fase: 5, tipo: "Bonus", costoXP: 0, recompensaXP: 20, elementoAdquiere: "+15 bloques magnéticos", requiere: ["41"] },
  { id: "45", nombre: "El invento imposible", fase: 5, tipo: "Secreta", costoXP: 0, recompensaXP: 40, mapaAnclaje: "43", requiere: ["44"] },
  { id: "46", nombre: "El gran proyecto", fase: 5, tipo: "Final", costoXP: 50, recompensaXP: 60, elementoAdquiere: "Insignia Maestro del Laboratorio (borrador)", requiere: ["43"] },
  {
    id: "47", nombre: "El laboratorio es tuyo", fase: 5, tipo: "Final secreto",
    costoXP: 0, recompensaXP: 100, insignia: "Maestro del Laboratorio",
    elementoAdquiere: "Modo Creativo + acceso a los 100 bloques",
    requiere: ["46"],
    historia: "Cuando llegues aquí, el laboratorio dejará de darte una receta. Has aprendido a controlar luces, botones, sensores, sonido, información y movimiento. Has ganado experiencia, elegido caminos y descubierto secretos. Ahora el laboratorio tiene una última pregunta: ¿qué puedes inventar tú?",
    objetivo: "Usa tus bloques magnéticos para construir una estructura. Usa el ESP32 como cerebro. Incluye al menos una entrada, un sensor, una salida y una decisión programada.",
    equipo: "Todo el kit + los 100 bloques magnéticos",
    descubrimiento: "El laboratorio permanecerá cerrado... hasta que alguien vuelva a necesitar un inventor.",
    desbloquea: "Modo Creativo",
  },
];
