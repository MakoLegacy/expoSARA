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
