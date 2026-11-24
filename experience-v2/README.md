# S.A.R.A. — Presentación ejecutiva (V5 en desarrollo)

**Sistema de Alerta y Respuesta Antamina**

Esta rama implementa una exposición ejecutiva para Presidencia y Vicepresidencias de Antamina. El producto principal S.A.R.A. se encuentra en [antito-yanac/sara](https://github.com/antito-yanac/sara); este repositorio contiene **solo la presentación**.

## Estados de publicación

| Rama | Uso |
| --- | --- |
| presentation-approved | Versión estable que publica el enlace público de GitHub Pages |
| development-v5 | Desarrollo experimental, pruebas y respaldo offline; **no actualiza el sitio público** |

El enlace público sigue siendo https://makolegacy.github.io/expoSARA/ y no se modifica al actualizar esta rama.

## Seis movimientos narrativos

1. **De la detección a la decisión** — aparecen progresivamente StrikeGuard y Keraunos, fuentes de contexto para el Centro de Control.
2. **La información existe; el reto es comprenderla** — la fricción operativa se revela en tres momentos.
3. **No creamos otro detector** — Keraunos, tres motores instalados en tres computadoras, S.A.R.A. y personal de campo se conectan visualmente. Los tres motores comparten fuente Keraunos; no equivalen a redundancia de origen.
4. **Cuatro zonas, una lectura más clara** — consulta visual de Yanacancha, Oficinas Mina, Tajo y Tucush y enlace directo a S.A.R.A. Las posiciones son esquemáticas, no geográficas.
5. **Menos fricción, más visibilidad** — beneficios esperados para Centro de Control, campo y liderazgo, sujetos a evaluación.
6. **De una solución operativa a una capacidad confiable** — validar, fortalecer y escalar, con evolución posible a respuesta a emergencias (no implementada ni aprobada). Una demostración opcional de continuidad se abre en un diálogo.

El contenido visible está basado en el guion ejecutivo acordado. El guion oral lo desarrolla el expositor: evitamos saturar los capítulos con párrafos.

## Motion graphics y narrativa visual

- Un mismo escenario del tajo permanece durante todos los capítulos. La cámara 2.5D se desplaza/escala de manera continua; no hay cortes de escenas.
- Cada capítulo se representa en una composición a pantalla completa. **Un gesto de rueda del mouse, una flecha, un botón o un deslizamiento táctil inicia toda la secuencia del capítulo de forma autónoma.** No es una barra de tiempo de video.
- La cámara viaja con easing durante 2,65 segundos. Los gráficos y textos entran de forma escalonada mediante una línea de tiempo GSAP; sus movimientos terminan aunque el presentador no vuelva a tocar el mouse.
- Avanzar: rueda abajo, flecha derecha/abajo, PageDown, espacio o control →. Retroceder: rueda arriba, flecha izquierda/arriba, PageUp o control ←. Home/End permiten abrir el primer/último capítulo. Cada gesto se limita a un capítulo para evitar saltos por inercia.
- Las transiciones pueden recorrerse hacia atrás: al regresar a un capítulo, su animación narrativa se reproduce nuevamente. El presentador conserva el control del ritmo entre capítulos.
- Se retiraron completamente los camiones y excavadoras artificiales de la iteración previa. Solo quedan nubes, oscurecimiento, lluvia ligera y destellos ambientales discretos.
- Se respetan preferencias del sistema para movimiento reducido.
- Los accesos originales a Keraunos y S.A.R.A. son enlaces externos interactivos. La simulación de respaldo es conceptual, no certificación de continuidad.
- El tajo es una **interpretación artística**, no cartografía minera ni información operacional en vivo.

## Ejecutar en Windows (PowerShell / VS Code)

Desde la carpeta raíz del repositorio:

    cd C:\Users\Pc\expoSARA
    git status
    git switch development-v5
    git pull --ff-only origin development-v5
    cd experience-v2
    npm.cmd install
    npm.cmd run dev

Abrir http://127.0.0.1:5173/ .

## Pruebas

    npm.cmd run test:v5
    npm.cmd run build
    npm.cmd run build:offline
    npm.cmd run test:offline

GitHub Actions ejecuta las mismas comprobaciones automáticamente en development-v5 sin publicar Pages. El respaldo de desarrollo se adjunta como SARA-V5-PREVIEW, con el archivo SARA_V5_PREVIEW_OFFLINE.html.

El archivo public/assets/antamina-cinematic.webp debe existir para generar tanto la versión web como el respaldo offline.

## Control de calidad para gerencia

Validar en Chrome y en el proyector real: legibilidad desde el auditorio, ritmo de apariciones por scroll, ubicación de botones, tiempos de carga, enlaces externos, contraste con tormenta, modo offline y la demostración opcional de continuidad. **No fusionar a presentation-approved hasta la aprobación explícita del usuario.**
