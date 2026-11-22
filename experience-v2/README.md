# S.A.R.A. — Digital Mining Experience (prototipo v0.1)

Esta versión es una experiencia de presentación independiente. **No reemplaza los archivos originales del repositorio**: el HTML, CSS y JavaScript actuales permanecen intactos en la raíz.

## Requisitos

- Node.js LTS y npm
- Navegador moderno con WebGL
- Visual Studio Code (opcional)

## Ejecutar localmente

Desde la raíz del repositorio, entra a la carpeta experience-v2 y ejecuta:

    npm install
    npm run dev

Vite mostrará la dirección local para abrir la experiencia en el navegador.

## Compilar para producción

    npm run build
    npm run preview

## Qué incluye esta primera iteración

- Escena WebGL con Three.js.
- Tajo procedural con terrazas, malla topográfica y curvas de nivel.
- Partículas, iluminación cálida y cámara con movimiento suave.
- Navegación narrativa de siete capítulos y cámara dirigida por scroll mediante GSAP ScrollTrigger.
- Diseño responsive y soporte para la preferencia de movimiento reducido.
- Contenido organizado a partir de las seis secciones de la presentación original.

## Alcance y validación pendiente

Este es un primer prototipo visual. Aún debe probarse en tu laptop y ajustarse con tus comentarios. Las métricas de altitud/coordenadas mostradas en la interfaz son elementos gráficos de ambientación, no datos topográficos operacionales. Las propuestas técnicas y declaraciones de seguridad se mantienen como contenido de la presentación base y deben validarse antes de presentarse como hechos implementados.


## V3: apertura fotorrealista y transformación digital

Se añadió una capa fotográfica cinematográfica sobre el terreno WebGL. El desplazamiento anima la fotografía y la difumina progresivamente para revelar el gemelo digital 3D en el capítulo de la propuesta S.A.R.A. La portada incorpora el botón «Ver gemelo digital», que permite comparar los dos modos.

### Recurso visual requerido

La imagen de concepto **no es topografía oficial ni una fotografía real**. El archivo es `public/assets/antamina-cinematic.webp` y se proporciona aparte en el paquete visual de esta iteración. Para verla en el proyecto local, coloca ese archivo exactamente en esa ubicación (sin cambiar el nombre), después ejecuta `npm.cmd run dev`. El código tiene degradación controlada: si no se encuentra el archivo, continúa mostrando la escena 3D anterior.

La composición está inspirada en las fotos de referencia compartidas. El desplazamiento de la fotografía es parallax 2D; la geometría 3D real comienza al mostrar el gemelo digital. Esto **no constituye un modelo 3D exacto del estado actual de Antamina**.


## V4 — Un solo tajo en toda la presentación

Esta versión reconstruye la presentación como un recorrido de la misma imagen del tajo de Antamina, con desplazamientos y zoom continuos de tipo **cámara 2.5D** controlados por scroll. No es un modelo topográfico 3D fotogramétrico: con una sola fotografía no es posible volar físicamente dentro de toda la excavación. Se conserva el mismo escenario visual en los siete encuadres narrativos (apertura + seis capítulos).

### Funciones recuperadas de la presentación original

- Capítulos 01 al 06 con los temas originales, resumidos en pantallas más legibles.
- Keraunos: enlace original https://qr.keraunos.co/t/mHMsMSjw7fLzlVFzMsh9K99cFG7tiC (capítulo 02).
- S.A.R.A.: enlace original https://antito-yanac.github.io/sara/ (capítulos 03 y 05).
- Información de StrikeGuard y Keraunos en diálogos accesibles.
- Simulación interactiva de redundancia del capítulo 06: falla API → tres motores (fallan por separado) → Keraunos manual → StrikeGuard manual. Incluye reiniciar la simulación.

### Identidad visual
Títulos **Orbitron**, textos **Rajdhani**; azul cyan, naranja y rojo. Se eliminó la antigua pantalla de malla azul que interrumpía el viaje visual.

### Instalar/actualizar
Desde la carpeta local:
\`\`\`powershell
cd C:\Users\Pc\expoSARA
git pull --ff-only origin redesign/immersive-3d-experience
cd experience-v2
npm.cmd install
npm.cmd run dev
\`\`\`
La imagen **public/assets/antamina-cinematic.webp** del paquete visual V3 sigue siendo necesaria: no se encuentra en la rama de GitHub. La V4 usa exactamente el mismo nombre de archivo; si ya la copiaste para la V3, no debes hacer nada más.

### Verificaciones
Ejecutar \`npm run build\`. La compilación automática de GitHub Actions verifica la sintaxis y la generación del bundle. La experiencia visual y su rendimiento deben verificarse en Chrome.
