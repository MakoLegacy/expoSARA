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


## Publicación web y respaldo offline (V4)

Recurso necesario: experience-v2/public/assets/antamina-cinematic.webp (imagen del paquete visual V3).

### GitHub Pages

1. En GitHub, abrir Settings → Pages → Build and deployment → Source → GitHub Actions.
2. Copiar y confirmar en la rama redesign/immersive-3d-experience la imagen public/assets/antamina-cinematic.webp.
3. El workflow .github/workflows/deploy-sara-pages.yml compilará Vite con base /expoSARA/ y desplegará en https://makolegacy.github.io/expoSARA/ una vez Pages esté habilitado.
4. Comprobar el job deploy y probar el sitio en Chrome antes de divulgarlo. No hay que fusionar a main.

### Respaldo para USB

Desde experience-v2 ejecutar:

    npm.cmd install
    npm.cmd run build:offline

Resultado: dist-offline/SARA_V4_OFFLINE.html. Contiene CSS, JS e imagen incrustados; ábrelo con doble clic en Chrome o Edge. No requiere localhost ni Node.js en el equipo de presentación.
Los enlaces externos a Keraunos y S.A.R.A. seguirán necesitando internet; sin internet las fuentes web serán reemplazadas por las locales.
El workflow también lo adjunta en su sección Artifacts bajo el nombre SARA-V4-OFFLINE.

### Pruebas antes de presentar

Probar pantalla completa (F11), siete encuadres, enlaces externos y simulación del capítulo 06, así como la copia offline con el Wi-Fi apagado. La imagen es una interpretación artística, no información geoespacial operativa.


## V5 desarrollo — vida del tajo (preview, no publicado)

La rama development-v5 contiene una versión experimental sobre la misma imagen panorámica. La V4 aprobada, servida por GitHub Pages desde presentation-approved, **no se ha modificado**.

- Cinco camiones mineros SVG avanzan por cuatro trayectorias ilustrativas, en el mismo espacio visual que la fotografía (cámara 2.5D).
- Dos excavadoras realizan movimientos mecánicos sutiles.
- Siete luminarias de la mina y los faros de los equipos se activan progresivamente con el oscurecimiento.
- Nubes, color ambiental, lluvia leve y destellos suaves evolucionan a medida que se avanza por los seis capítulos.
- prefers-reduced-motion desactiva los movimientos ambientales continuos.
- Se conservaron los enlaces originales a Keraunos y S.A.R.A. y la simulación de redundancia del capítulo 06.
- **No hay datos operacionales en vivo**: ubicación de maquinaria, vías y clima son simulaciones artísticas.

Para probar en tu laptop (PowerShell, repositorio local limpio):

    cd C:\Users\Pc\expoSARA
    git switch development-v5
    git pull --ff-only origin development-v5
    cd experience-v2
    npm.cmd install
    npm.cmd run dev

La ruta http://127.0.0.1:5173/?debugRoutes=1 permite mostrar las rutas ilustrativas de acarreo para calibrar su posición en la foto. La web pública de gerencia **no se actualiza** desde esta rama.

Para generar la copia HTML de prueba:

    npm.cmd run build:offline
    npm.cmd run test:offline

Archivo: experience-v2/dist-offline/SARA_V5_PREVIEW_OFFLINE.html.
El workflow de desarrollo también genera el artefacto SARA-V5-PREVIEW sin publicar GitHub Pages.

La implementación requiere validación visual en Chrome para ajustar la coincidencia entre los caminos pintados en la imagen y las rutas SVG superpuestas.
