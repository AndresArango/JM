# El Laboratorio Secreto — Juan Martín, Ingeniero de Redstone

Página de regalo: el "tablero visual" del progreso de Juan Martín en su
aventura de electrónica. **No tiene backend ni base de datos**: todo el
estado real vive en un archivo Excel (`data/estado.xlsx`) que tú controlas.
La página solo lee ese archivo y lo dibuja bonito.

## Cómo funciona el flujo (resumen)

1. Juan Martín arma el experimento en la vida real.
2. Tú supervisas y confirmas que funciona.
3. Abres `data/estado.xlsx`, en la hoja **Misiones** cambias esa fila:
   - `Estado` → `Completada`
   - `Fecha_Aprobacion` → la fecha de hoy
4. Si la misión era parte de una bifurcación (por ejemplo 06 vs 07) y él
   jugó solo una, puedes dejar la otra en `Pendiente` o marcarla como
   `Omitida` para que se vea como "ruta no elegida" en vez de "bloqueada".
5. Si canjea XP disponible por algo (premio, tiempo extra, etc.), agrega
   una fila en la hoja **Canjes**.
6. Guardas el archivo, lo subes al repositorio (`git add`, `git commit`,
   `git push`) — Cloudflare Pages redespliega solo en 1-2 minutos.
7. Juan Martín entra a la página (o toca "Actualizar laboratorio") y ve
   su nuevo estado: XP, insignias y la siguiente misión desbloqueada.

**Juan Martín nunca puede editar nada por su cuenta** — solo tú, editando
el Excel fuera de la página.

## Estructura de carpetas

```
JM/
├── index.html               ← página que ve Juan Martín
├── data/
│   └── estado.xlsx          ← el único archivo que tú editas seguido
├── assets/
│   ├── css/style.css        ← estilos (identidad visual del laboratorio)
│   └── js/
│       ├── missions.js      ← contenido fijo de cada misión (historia, XP, etc.)
│       └── app.js           ← motor: lee el Excel y calcula qué se desbloquea
└── README.md                ← este archivo
```

## Cómo agregar una misión nueva

El costo/recompensa de XP y el texto de cada misión **no están en el
Excel**, están en `assets/js/missions.js` (para que tú no tengas que tocar
fórmulas ni reescribir historia dentro de una celda). El Excel solo guarda
si ya se jugó o no.

1. En `missions.js`, copia un bloque del arreglo `MISSIONS` y cambia:
   `id`, `nombre`, `costoXP`, `recompensaXP`, `requiere` y los textos.
2. En `estado.xlsx`, agrega una fila nueva en la hoja **Misiones** con el
   mismo `ID`, `Estado = Pendiente`.
3. `requiere` controla qué debe estar completado antes de que se muestre
   esa misión:
   - `[]` → disponible desde el inicio
   - `["02"]` → exige la misión 02 completada
   - `[{ anyOf: ["06","07"] }]` → exige 06 **o** 07 (para bifurcaciones)

Por ahora solo están armadas las misiones **01, 02, 06 y 07** como
demostración del motor, más una vista previa bloqueada de la **misión
final (40)**. El resto del contenido narrativo de las 40 misiones (ya
tienes el mapa completo en la Guía del Arquitecto) se va agregando de a
poco siguiendo el mismo patrón.

## Publicar en Cloudflare Pages (nueva URL, mismo repositorio)

Como quieres una URL nueva sin mezclar esto con el proyecto de ventas, la
forma más simple es crear un **segundo proyecto de Cloudflare Pages** que
apunte al mismo repositorio de GitHub, pero con una carpeta raíz distinta:

1. En [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Elige el mismo repositorio de GitHub que ya usas para ventas.
3. En **Build settings**:
   - Framework preset: `None`
   - Build command: *(vacío, no hace falta)*
   - Build output directory / Root directory: `JM`
4. Ponle un nombre de proyecto distinto (por ejemplo `laboratorio-jm`) —
   Cloudflare te da una URL tipo `laboratorio-jm.pages.dev` automáticamente,
   separada por completo del proyecto de ventas.
5. Cada vez que hagas `git push` con cambios dentro de `JM/`, este
   proyecto se redespliega solo (igual que el de ventas).

Si prefieres un dominio propio en vez del `.pages.dev`, se agrega después
en **Custom domains** dentro de ese mismo proyecto — dime si quieres que lo
dejemos armado también.

## Nota técnica

La página lee `estado.xlsx` directamente en el navegador (con la librería
SheetJS, cargada desde un CDN) — no necesitas convertir el Excel a nada
antes de subirlo, tal cual lo guardas desde Excel funciona.
