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

## FASE 2 — CONSTRUCTOR (misiones 11 a 19)

### 11 · El semáforo secreto
**Elementos exactos:** 3 LED (rojo, amarillo, verde) · 3 resistencias 220Ω.
**Paso a paso:**
1. Monta los 3 LEDs como en la misión 05, cada uno en su propio pin GPIO (reutiliza los mismos de esa misión si ya los tienes anotados).
2. Programa una secuencia: rojo encendido X segundos → apaga rojo, enciende amarillo Y segundos → apaga amarillo, enciende verde Z segundos → repetir.
3. Deja que Juan Martín decida los tiempos de cada color.

### 12 · El botón maestro
**Elementos:** 1 botón pulsador · el semáforo de la misión 11.
**Paso a paso:** conecta el botón con `INPUT_PULLUP`. En vez de avanzar la secuencia sola con `delay()`, que solo avance al detectar una pulsación nueva (cuidado con "rebotes" del botón — si salta más de un paso por clic, es normal, no hay que sobre-explicarlo, es un buen tema para la Fase 4).

### 13 · El potenciómetro mágico
**Elementos:** 1 potenciómetro 10k.
**Paso a paso:**
1. Conecta las 2 patas externas del potenciómetro a 3.3V y GND, y la pata central a un pin GPIO con entrada analógica (anótalo: ____).
2. Lee el valor con el código y muéstralo (por ejemplo, en el monitor serie) para que Juan Martín vea los números cambiar al girar la perilla.
3. Traduce ese valor a algo visible: por ejemplo, cuántos de los 3 LEDs de la misión 11 están encendidos.

### 14 · Controla la intensidad
**Elementos:** el potenciómetro de la misión 13 + 1 LED nuevo + resistencia 220Ω.
**Paso a paso:** usa el valor leído del potenciómetro para controlar la salida PWM de un LED (brillo variable), en vez de solo contar LEDs encendidos.

### 15 · La alarma del laboratorio
**Elementos:** 1 botón · 1 LED · 1 buzzer pasivo.
**Paso a paso:**
1. Conecta el buzzer pasivo a un pin PWM (anótalo: ____).
2. Al presionar el botón: enciende el LED y reproduce un tono con el buzzer al mismo tiempo.
3. Al soltar: apaga ambos.

### 16 · El sonido que avisa
**Elementos:** 1 buzzer activo (distinto al pasivo de la misión 15).
**Paso a paso:** conéctalo a un pin digital simple (no necesita PWM, solo HIGH/LOW). Programa un patrón de pitidos (ej. 3 cortos + 1 largo) y compara con Juan Martín cómo suena distinto al buzzer pasivo.

### 17 · El relé misterioso
**Elementos:** 1 módulo relé de 1 canal (5V).
**Nota de seguridad:** el relé solo controla, del lado de carga, un circuito de bajo voltaje que tú hayas verificado antes (por ejemplo una tira de LEDs de 5V, nunca algo conectado a la red eléctrica).
**Paso a paso:**
1. Conecta el pin de señal del relé a un GPIO digital (anótalo: ____), y su alimentación según indique tu módulo (normalmente 5V y GND).
2. Prueba primero SIN nada conectado a la salida del relé — solo para escuchar el clic y confirmar que el código lo activa.
3. Solo entonces conecta el circuito externo de baja tensión que ya verificaste.

### 18 · El código de colores (Bonus)
**Elementos:** resistencias variadas.
**Paso a paso:** repaso rápido, similar a la misión 09 pero con resistencias distintas — puedes usarlo como recordatorio antes de la Fase 3.

### 19 · La feria de luces
**Elementos:** todos los componentes usados en la Fase 2.
**Paso a paso:** deja que Juan Martín elija libremente al menos 3 componentes (LED, botón, potenciómetro, buzzer, relé) y arme algo propio. Tu rol aquí es de espectador, no de guía — anota qué eligió y por qué, para la próxima conversación.

---

## FASE 3 — SENTIDOS (misiones 20 a 30)

### 20 · El laboratorio tiene fiebre
**Elementos:** 1 sensor DHT11.
**Paso a paso:**
1. Conecta el pin de datos del DHT11 a un GPIO digital (anótalo: ____). Revisa si tu módulo ya trae la resistencia pull-up incorporada (la mayoría de módulos de 3 pines sí la traen); si es el sensor "pelado" de 4 pines, necesitas agregar una resistencia de 10kΩ entre datos y VCC.
2. Instala la librería del sensor (busca "DHT sensor library" de Adafruit en el gestor de librerías del IDE).
3. Lee y muestra la temperatura.

### 21 · ¿Qué tan húmedo está?
**Elementos:** el mismo DHT11.
**Paso a paso:** sin cambiar el cableado, agrega la lectura de humedad del mismo sensor y muéstrala junto a la temperatura.

### 22 · El sensor que ve
**Elementos:** 1 fotoresistencia (LDR) · 1 resistencia (10kΩ recomendada).
**Paso a paso:**
1. Arma un divisor de voltaje: LDR en serie con la resistencia, entre 3.3V y GND.
2. Conecta el punto medio (entre la LDR y la resistencia) a un pin analógico (anótalo: ____).
3. Lee el valor y muéstralo mientras tapas y destapas el sensor con la mano.

### 23 · La luz fantasma
**Elementos:** la fotoresistencia de la misión 22 + 1 LED.
**Paso a paso:** define con Juan Martín un valor umbral (probando en vivo qué número marca "oscuro"), y programa que el LED se encienda solo cuando la lectura baje de ese umbral.

### 24 · El detector de obstáculos
**Elementos:** 1 módulo de evasión de obstáculos (IR).
**Paso a paso:**
1. Conecta VCC, GND y el pin de salida digital a un GPIO (anótalo: ____).
2. La mayoría de estos módulos traen un potenciómetro pequeño para ajustar la distancia de detección — muéstraselo a Juan Martín y dejen que prueben distintos ajustes.
3. Lee el estado (HIGH/LOW) y enciende un LED cuando detecte algo cerca.

### 25 · ¿Hay alguien ahí? (Ruta A)
**Elementos:** 1 sensor PIR (HC-SR501).
**Paso a paso:**
1. Conecta VCC, GND y el pin de salida a un GPIO digital (anótalo: ____).
2. Importante: el PIR necesita 30-60 segundos de calibración inicial después de energizarse — si marca detección todo el tiempo al principio, es normal, espera un minuto.
3. Tiene dos potenciómetros pequeños (sensibilidad y tiempo de retardo) — pueden experimentar juntos con ambos.

### 26 · El oído electrónico (Ruta B)
**Elementos:** el buzzer ya desbloqueado (pasivo o activo).
**Paso a paso:** no hay cableado nuevo. El reto es de diseño: junto con Juan Martín, inventen un patrón de pitidos (cantidad, duración, pausas) que sea reconocible como "alerta del laboratorio".

### 27 · La pantalla secreta
**Elementos:** 1 pantalla OLED 0.96" (I2C).
**Paso a paso:**
1. Conecta SDA y SCL a los pines I2C del ESP32 (en la mayoría de placas DevKit son GPIO 21 y GPIO 22, pero confírmalo contra tu placa) además de VCC y GND.
2. Instala una librería compatible (Adafruit_SSD1306 + Adafruit_GFX, o U8g2).
3. La dirección I2C más común en estos módulos es `0x3C` — si no detecta la pantalla, prueba con `0x3D` o corre un "I2C scanner" para confirmarla.
4. Muestra un mensaje de texto simple como primera prueba.

### 28 · El laboratorio habla
**Elementos:** el sensor de la ruta elegida (25 o 26) + la pantalla OLED de la misión 27.
**Paso a paso:** combina ambos circuitos (ya probados por separado) para que, al detectar algo, la pantalla muestre un mensaje en vez de (o además de) encender un LED.

### 29 · El mapa de sensores (Bonus)
**Elementos:** todos los sensores desbloqueados hasta ahora (DHT11, LDR, IR, y el de la ruta elegida).
**Paso a paso:** muéstralos todos conectados a la vez y lee sus valores juntos en el monitor serie — es más una demostración que una construcción nueva.

### 30 · El código secreto del sensor (Bonus)
**Elementos:** ninguno nuevo — se desbloquea al usar el sistema de canjes por primera vez, no por armar un circuito.

---

## FASE 4 — INGENIERO DE REDSTONE (misiones 31 a 40)

### 31 · El guardián de temperatura
**Elementos:** el DHT11 + una salida (LED, buzzer u OLED, lo que ya tengan armado).
**Paso a paso:** define con Juan Martín un valor límite de temperatura, y programa un `if` que active la salida solo cuando se supere.

### 32 · La máquina de decisiones
**Elementos:** el mismo sensor + salidas.
**Paso a paso:** convierte el `if` simple en `if / else if / else`, con al menos 3 rangos distintos (ej. frío / normal / caliente), cada uno con su propia reacción.

### 33 · Si pasa esto...
**Elementos:** dos sensores distintos ya desbloqueados (ej. fotoresistencia + PIR) + una salida.
**Paso a paso:** combina ambas lecturas con un operador lógico (`&&` para "ambas", `||` para "cualquiera") y que la salida solo reaccione según esa combinación.

### 34 · La puerta secreta 2.0 (Ruta A)
**Elementos:** sensor de presencia (PIR o IR, el que prefieran) + salida a elección.
**Paso a paso:** diseño libre — Juan Martín elige la combinación, tú solo verificas que el cableado sea correcto antes de energizar.

### 35 · Alarma de intrusos (Ruta B)
**Elementos:** sensor de presencia + LED + buzzer.
**Paso a paso:** combina los tres en una sola reacción activada por el sensor — luz y sonido a la vez.

### 36 · El detector de luz
**Elementos:** fotoresistencia + salidas.
**Paso a paso:** divide el rango de lectura de luz en 3 zonas (oscuro / penumbra / luz plena) con `if/else if/else`, cada una con una reacción distinta.

### 37 · El motor cobra vida ⚠️
**Elementos:** módulo relé · motor + hélice · fuente de alimentación apropiada para el motor (revisa el voltaje que necesita tu motor específico — normalmente NO es el mismo que el del ESP32).
**Notas de seguridad (léelas antes de armar):**
- El motor **nunca** se conecta directo a un pin GPIO — siempre a través del relé.
- Prueba primero el relé solo (sin el motor conectado) para confirmar que hace clic cuando el código lo activa.
- Confirma el voltaje y la corriente que necesita tu motor antes de energizarlo — no asumas que es igual al del ESP32.
- Supervisa siempre que la hélice esté libre de cables sueltos, dedos y bloques magnéticos antes de energizar.
**Paso a paso:**
1. Conecta el pin de señal del relé a un GPIO (anótalo: ____).
2. Conecta el motor al lado de carga del relé, con su propia fuente de alimentación apropiada.
3. Prueba encender/apagar el motor desde el código, con Juan Martín observando desde una distancia segura la primera vez.

### 38 · La máquina automática
**Elementos:** un sensor a elección + el motor (vía relé).
**Paso a paso:** conecta el sensor elegido para que, al detectar algo, active el motor por un tiempo determinado y luego lo apague solo.

### 39 · El circuito misterioso
**Elementos:** cualquier circuito ya armado.
**Paso a paso:** antes de la sesión, cambia intencionalmente algo pequeño (un cable a un pin distinto, una línea de código comentada, una polaridad invertida) y deja que Juan Martín lo diagnostique por su cuenta. Ten preparado el circuito "correcto" aparte, por si se frustra y necesita comparar.

### 40 · La fábrica de piezas (Bonus)
**Elementos:** ninguno nuevo — se desbloquea automáticamente al completar la misión 37 (el motor).

---

## FASE 5 — INVENTOR (misiones 41 a 47)

### 41 · El reto de los tres componentes
**Elementos:** 3 componentes elegidos entre los ya desbloqueados.
**Paso a paso:** elige tú (o sortéenlos) tres componentes al azar y deja que Juan Martín decida cómo combinarlos. No hay instrucciones de cableado fijas — tu rol es solo de seguridad (revisar polaridades y voltajes antes de energizar).

### 42 · La máquina de reacción
**Elementos:** 1 LED · 1 botón.
**Paso a paso:** programa que se encienda el LED en un momento aleatorio, y mide con `millis()` el tiempo hasta que se presiona el botón. Muestra el resultado en el monitor serie o en la OLED si ya la tienen conectada.

### 43 · El desafío de los sensores
**Elementos:** 2 sensores a elección.
**Paso a paso:** diseño libre, igual que la 41 pero con sensores. Deja que Juan Martín proponga la idea completa antes de tocar el cableado.

### 44 · La máquina inútil (Bonus)
**Elementos:** ninguno nuevo.
**Paso a paso:** reto puramente creativo — construir algo que "no sirva para nada" a propósito (un clásico de ingeniería para practicar sin presión). No necesita preparación técnica de tu parte.

### 45 · El invento imposible (Secreta)
**Elementos:** cualquier componente del kit, sin restricciones.
**Paso a paso:** esta es abierta a propósito — no le des instrucciones, solo la pregunta del final del archivo de misiones ("¿qué inventarías si nadie te dijera que es imposible?"). Tu rol es solo de seguridad.

### 46 · El gran proyecto (Final)
**Elementos:** todo el kit + los bloques magnéticos.
**Paso a paso:**
1. Antes de tocar nada, pídele a Juan Martín que dibuje o describa su idea completa (qué entrada, qué sensor, qué salida, qué decisión).
2. Revisa la idea con él: ¿es segura? ¿usa componentes que ya conoce?
3. Déjalo construir con la menor intervención posible — este es el momento de ver cuánto aprendió, no de enseñar algo nuevo.
4. Prueba de seguridad final tuya antes de la primera energización completa.

### 47 · El laboratorio es tuyo (Final secreto)
**Elementos:** modo creativo — ya no hay reglas de cableado, solo supervisión de seguridad general.
**Paso a paso:** ninguno — es la recompensa por terminar. Disfruten juntos el "modo libre" con todos los bloques y el kit completo desbloqueado.

---

Con esto quedan las 47 misiones completas: historia + paso a paso técnico.
Los cambios menores que se necesiten (ajustar un tiempo, cambiar un pin,
afinar una historia) se hacen directo sobre estos mismos archivos cuando
haga falta.
