# Guía del Supervisor — El Laboratorio Secreto

Este documento es **solo para ti**. Juan Martín no debería leerlo: la gracia
del juego es que él prediga, pruebe y descubra. Aquí tienes lo que
necesitas para prepararle cada experimento con seguridad y confianza,
aunque no seas electrónico de formación.

Antes de cada misión: revisa la lista de elementos, arma el circuito TÚ
primero (regla de oro de la Guía del Arquitecto), y solo entonces
preséntasela a Juan Martín como el reto del laboratorio.

Sobre los pines del ESP32: en las instrucciones vas a ver algo como
"conecta a un GPIO digital libre (ej. GPIO 2)". Es una sugerencia, no un
número fijo — confírmalo contra la serigrafía real de tu placa (los
números impresos junto a cada pin) y anota en este documento cuál usaste,
así reutilizas el mismo en las siguientes misiones sin tener que
adivinar cada vez. Evita pines marcados como entrada-only (34 a 39) para
salidas como LEDs.

---

## Glosario de componentes (para ti y para cuando Juan Martín pregunte)

| Componente | Qué hace | Para qué sirve en el laboratorio |
|---|---|---|
| ESP32 DevKit (WROOM-32) | Es la "computadora" pequeña que ejecuta el código | El cerebro de todo el laboratorio |
| Protoboard (830 puntos) | Tablero para armar circuitos sin soldar | Donde se conecta todo |
| LED (rojo/amarillo/verde) | Se enciende cuando pasa corriente en el sentido correcto | Primeras salidas visuales |
| LED RGB | Un solo LED con 3 colores mezclables (rojo, verde, azul) | Salidas de color, luces de estado |
| Resistencia (220Ω/1kΩ/10kΩ) | Limita cuánta corriente pasa | Protege LEDs y sensores de quemarse |
| Botón pulsador | Interruptor que se activa al presionar | Primera entrada digital |
| Potenciómetro (10k) | Perilla que cambia un valor de forma gradual | Primera entrada analógica |
| Buzzer pasivo | Suena solo si el código le manda un tono específico | Melodías y patrones de sonido |
| Buzzer activo | Suena con un solo tono fijo, sin variación | Alarmas simples on/off |
| Sensor DHT11 | Mide temperatura y humedad del aire | Fase Sentidos |
| Fotoresistencia (LDR) | Cambia su valor eléctrico según la luz que recibe | Detectar luz/oscuridad |
| Módulo evasión de obstáculos (IR) | Detecta objetos cercanos con luz infrarroja | Detectar presencia/distancia corta |
| Sensor PIR (HC-SR501) | Detecta movimiento de personas/animales por calor | Vigilancia de movimiento |
| Pantalla OLED (0.96") | Muestra texto o dibujos pequeños | El laboratorio "habla" con mensajes |
| Módulo relé (1 canal, 5V) | Un interruptor electrónico que el ESP32 puede prender/apagar | Controlar algo externo de forma segura (como el motor) sin conectarlo directo a un GPIO |
| Motor + hélice | Convierte electricidad en movimiento giratorio | Fase 4, siempre a través del relé, nunca directo a un GPIO |
| Bloques magnéticos (100, Minecraft) | Piezas de construcción | Carcasa/estructura física de cada invento |

---

## FASE 1 — DESPERTAR (misiones 01 a 10)

### 01 · La puerta secreta
**Elementos exactos:** 1 LED (cualquier color) · 1 resistencia 220Ω · 2-3 cables Dupont M-M · protoboard · cable USB.
**Paso a paso:**
1. Conecta el ESP32 sobre la protoboard.
2. Inserta el LED: la pata larga (ánodo) y la corta (cátodo) en canales distintos de la protoboard.
3. Conecta la resistencia de 220Ω entre el cátodo del LED y un pin GND del ESP32.
4. Conecta el ánodo del LED a un pin GPIO digital libre (anótalo aquí: ____). Este mismo pin lo vas a reutilizar en 02 y 04.
5. Sube un programa que ponga ese pin en HIGH.
6. Si no enciende: revisa primero la polaridad del LED antes de sospechar del código — es el error más común.

### 02 · La luz que despierta
**Elementos:** el mismo circuito de la misión 01, sin cambios físicos.
**Paso a paso:** cambia el código para alternar `HIGH`/`LOW` con una espera (`delay`) entre cada cambio. Prueba con Juan Martín distintos tiempos de espera.

### 03 · El mapa de los electrones
**Elementos:** la protoboard sola, y los componentes sueltos (sin conectar).
**Paso a paso:** muéstrale las filas y columnas conectadas internamente en la protoboard, y los rieles de alimentación (+ / −) en los bordes. No hay circuito que armar todavía, es identificar el terreno.

### 04 · El primer parpadeo
**Elementos:** igual a la misión 02.
**Paso a paso:** mismo circuito, ahora el foco es el `loop()` — que el patrón se repita solo, sin que nadie vuelva a tocar el botón de reset.

### 05 · Tres colores
**Elementos:** 3 LED (rojo, amarillo, verde) · 3 resistencias 220Ω.
**Paso a paso:** repite el montaje de la misión 01 tres veces en paralelo, en 3 pines GPIO distintos (anótalos: ____, ____, ____). Programa que enciendan en secuencia, uno a la vez.

### 06 · El botón mágico (Ruta A)
**Elementos:** 1 botón pulsador · el LED de la misión 05.
**Paso a paso:** conecta el botón a un pin GPIO configurado con `INPUT_PULLUP` (así no necesitas resistencia externa) y a GND. Lee su estado y usa eso para encender/apagar el LED.

### 07 · Los colores del laboratorio (Ruta B)
**Elementos:** 1 LED RGB (de los 2 disponibles) · 3 resistencias 220Ω.
**Paso a paso:** identifica las 4 patas del LED RGB (la más larga suele ser el cátodo o ánodo común — confírmalo con la ficha técnica del tuyo). Conecta cada color a un pin con salida PWM. Escribe valores de 0 a 255 en cada pin para mezclar colores.

### 08 · El código secreto
**Elementos:** reutiliza el circuito de la misión 06 o 07 (la ruta que haya jugado).
**Paso a paso:** aquí no se cablea nada nuevo — es la primera explicación completa de `setup()`, `loop()`, variables y comentarios.

### 09 · La resistencia invisible (Bonus)
**Elementos:** varias resistencias sueltas de 220Ω/1kΩ/10kΩ.
**Paso a paso:** reto de identificar el valor de cada una por su código de colores (usa una tabla de colores de resistencias). No requiere circuito armado.

### 10 · Dos luces, una misión
**Elementos:** 2 LED · 2 resistencias 220Ω (puedes reutilizar 2 de los de la misión 05).
**Paso a paso:** controla 2 salidas en pines distintos con lógica distinta cada una (por ejemplo, una parpadea rápido y la otra lento, al mismo tiempo).

---

*Las fases 2 a 5 se agregan en el mismo formato a medida que las vayamos
cerrando en la conversación — dímelo cuando quieras que siga con la
Fase 2.*
