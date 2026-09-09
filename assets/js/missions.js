/**
 * EL LABORATORIO SECRETO — Contenido de misiones
 * -------------------------------------------------
 * Este archivo vive en el repositorio (no en el Excel). Aquí va todo lo que
 * NUNCA cambia solo: la historia, el objetivo, el equipo autorizado, el costo
 * y la recompensa de XP de cada misión.
 *
 * Lo único que cambia en el día a día (si la misión ya está completada, la
 * fecha y qué ruta se jugó) vive en data/estado.xlsx — ver app.js.
 *
 * Para agregar una misión nueva: copia un bloque, cambia el "id" (usa el
 * mismo número que en el Excel, con dos cifras: "03", "12", "40"...) y
 * llena los campos. Si depende de otra(s) misión(es), usa "requiere".
 *
 * requiere:
 *   []                     -> sin requisito, disponible desde el inicio
 *   ["02"]                 -> exige que la misión 02 esté completada
 *   [{ anyOf: ["06","07"] }] -> exige que 06 O 07 esté completada (bifurcación)
 */

const MISSIONS = [
  {
    id: "01",
    nombre: "La puerta secreta",
    fase: 1,
    tipo: "Principal",
    costoXP: 0,
    recompensaXP: 20,
    insignia: "Domador de Electrones",
    requiere: [],
    historia:
      "El laboratorio está oscuro. Sobre una mesa encuentras una pequeña computadora, una placa llena de agujeros y una luz diminuta. Una nota dice: “Ingeniero Juan Martín: si consigues despertar esta luz, la primera puerta se abrirá.”",
    objetivo: "Construir tu primer circuito con el ESP32, un LED y una resistencia.",
    prediccion: "¿Qué crees que necesita una luz para encenderse? ¿Basta con poner dos cables en cualquier lugar?",
    equipo: "ESP32 · protoboard · 1 LED · 1 resistencia apropiada · cables Dupont · cable USB",
    protocolo: "El diagrama final se verifica para la placa real de Juan Martín. No se improvisan conexiones ni se usan componentes bloqueados.",
    descubrimiento: "Un circuito necesita un camino eléctrico completo. La resistencia protege al LED limitando la corriente.",
    desbloquea: "Misión 02 — La luz que despierta",
  },
  {
    id: "02",
    nombre: "La luz que despierta",
    fase: 1,
    tipo: "Principal",
    costoXP: 15,
    recompensaXP: 20,
    insignia: "Guardián del Tiempo",
    requiere: ["01"],
    historia:
      "La primera luz sigue encendida, pero está quieta. El laboratorio susurra: “Una luz que no cambia nunca... no cuenta nada.” Algo en el código puede hacer que aparezca y desaparezca sola.",
    objetivo: "Hacer que el mismo LED se encienda y se apague solo, en un patrón que tú decidas.",
    prediccion: "¿Qué pasará si le pides al programa que espere entre un encendido y otro? ¿Puedes hacer que parpadee rápido o lento?",
    equipo: "ESP32 · protoboard · 1 LED · 1 resistencia apropiada · cables Dupont",
    protocolo: "Se reutiliza el circuito de la Misión 01. Antes de cambiar el código, predice qué va a pasar y anótalo en tu bitácora.",
    descubrimiento: "Un programa puede repetir instrucciones controlando el tiempo entre pasos: así nace el primer patrón.",
    desbloquea: "Misión 06 y Misión 07 — elige tu ruta",
  },
  {
    id: "06",
    nombre: "El botón mágico",
    fase: 2,
    tipo: "Ruta A",
    rutaGrupo: "fork-2",
    costoXP: 20,
    recompensaXP: 25,
    insignia: "Maestro del Clic",
    requiere: ["02"],
    historia:
      "Junto al LED aparece un botón nuevo, todavía sin cables. El laboratorio pregunta: “¿Puedes hacer que algo dependa de una decisión, en vez de repetirse solo?”",
    objetivo: "Conectar un botón que encienda el LED solo mientras se presiona (o mientras esté en un estado).",
    prediccion: "¿Qué pasará si sueltas el botón? ¿Y si lo dejas presionado mucho tiempo?",
    equipo: "ESP32 · protoboard · 1 botón · 1 LED · resistencias apropiadas · cables Dupont",
    protocolo: "Primero se prueba el botón solo (leyendo su estado), y después se conecta a la salida del LED.",
    descubrimiento: "Una entrada digital solo tiene dos estados: presionado o no presionado. De ahí nace toda decisión electrónica.",
    desbloquea: "Fase 3 (próximamente)",
  },
  {
    id: "07",
    nombre: "Los colores del laboratorio",
    fase: 2,
    tipo: "Ruta B",
    rutaGrupo: "fork-2",
    costoXP: 20,
    recompensaXP: 25,
    insignia: "Pintor de Luz",
    requiere: ["02"],
    historia:
      "En vez de un botón, el laboratorio te entrega un LED distinto: uno que puede mostrar muchos colores a la vez. “Redstone tiene un color. Este laboratorio tiene todos”, dice la nota.",
    objetivo: "Hacer que un LED RGB cambie de color siguiendo una secuencia que tú diseñes.",
    prediccion: "¿Cómo crees que un solo LED puede mostrar varios colores? ¿Qué pasa si mezclas dos colores a la vez?",
    equipo: "ESP32 · protoboard · 1 LED RGB · resistencias apropiadas · cables Dupont",
    protocolo: "Se identifican las patas del LED RGB antes de conectarlo. No se fuerza ninguna pata contra otra.",
    descubrimiento: "Mezclando distintas intensidades de rojo, verde y azul se puede crear casi cualquier color.",
    desbloquea: "Fase 3 (próximamente)",
  },
];

/**
 * Vista previa de la Misión Final (40). No participa del motor de
 * requisitos: es solo un vistazo bloqueado que se muestra siempre al
 * final del mapa para dar ganas de seguir jugando.
 */
const FINAL_PREVIEW = {
  id: "40",
  nombre: "El laboratorio es tuyo",
  fase: 5,
  tipo: "Final secreto",
  recompensaXP: 100,
  insignia: "Maestro del Laboratorio",
  teaser:
    "Cuando llegues aquí, el laboratorio dejará de darte una receta. Tendrás que inventar tú mismo una máquina con al menos una entrada, un sensor, una salida y una decisión programada.",
};
