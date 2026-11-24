# S.A.R.A. — Presentación ejecutiva híbrida V6

**Nombre completo:** Sistema de Alerta y Respuesta Antamina.  
**Código de la presentación:** rama de desarrollo \`development-v5\` del repositorio expoSARA (se conserva esta rama para no romper el mecanismo de publicación).  
**Código del producto S.A.R.A.:** https://github.com/antito-yanac/sara (otro repositorio).

## Enlaces

- **Presentación formal V4:** https://makolegacy.github.io/expoSARA/ — sale exclusivamente de \`presentation-approved\`. No se cambia sin autorización.
- **Vista previa V6:** https://makolegacy.github.io/expoSARA/preview/ — sale del código de \`development-v5\` después de pasar las pruebas. Es experimental.

No se requiere localhost, instalar herramientas ni usar la laptop original para ver la vista previa desde otra PC.

## Siete capítulos narrativos

1. **Contexto operacional:** De la detección a la decisión; StrikeGuard, Keraunos, monitoreo del Centro de Control y aviso radial.
2. **Problemática:** La alerta se comunica, pero el trabajador puede requerir más claridad por zona. No se descalifican los sistemas oficiales.
3. **Solución:** Cuatro zonas, una lectura más clara. Enlace a S.A.R.A., sin fingir alertas en vivo en la maqueta.
4. **Ingeniería:** Tres motores actuales que consultan la misma web Keraunos desde tres computadoras. Posible integración API futura.
5. **Cultura preventiva:** Propuesta de consulta previa a salir a campo; durante las actividades se mantienen los avisos radiales oficiales y las medidas de seguridad.
6. **Valor esperado:** Centro de Control, personal de campo y liderazgo; beneficios por medir, no indicadores inventados.
7. **Visión:** Validar, fortalecer y escalar con un piloto controlado. Diagrama opcional de continuidad API futura → motores web → Keraunos manual → StrikeGuard manual.

## Precisión operacional

La V6 distingue expresamente información operativa actual y propuestas:

- **Actualmente no existe una práctica formal de consulta previa** por parte del personal de campo, según el contexto facilitado por el operador. S.A.R.A. podría ayudar a fomentar ese hábito, sujeto a coordinación y validación institucional.
- **No hay notificaciones web en segundo plano para quien no tenga abierto el sistema.** No se simula una notificación push; el aviso del capítulo 05 se identifica como visible dentro de la consulta web.
- Las comunicaciones del Centro de Control y los procedimientos oficiales siguen siendo esenciales durante toda la jornada. Una consulta inicial no garantiza una alerta posterior.
- Las tres computadoras consultan la misma fuente Keraunos; eso no equivale a redundancia completa del origen.
- La integración API y el módulo de respuesta a emergencias son planes futuros. No se presentan como capacidades plenamente implementadas ni aprobadas.
- El tajo se muestra como **ilustración cinematográfica**, nunca como cartografía actualizada o telemetría real.

## Motion graphics

Se mantiene una sola escena minera y siete puntos de cámara 2.5D. Un único gesto de rueda del mouse, flechas, PageUp/Down o pulsaciones de controles inicia la transición completa y autónoma, sin necesitar mantener el scroll. Los 75+ elementos narrativos se revelan gradualmente. Los camiones artificiales siguen eliminados. Se mantienen efectos discretos de nubes, lluvia y oscurecimiento.

## Ejecutar y probar en Windows

\`\`\`powershell
cd C:\Users\Pc\expoSARA
git status
git switch development-v5
git pull --ff-only origin development-v5
cd experience-v2
npm.cmd install
npm.cmd run dev
\`\`\`

Abrir http://127.0.0.1:5173/ .

\`\`\`powershell
npm.cmd run test:v6
npm.cmd run build
npm.cmd run build:offline
npm.cmd run test:offline
\`\`\`

El respaldo local es \`dist-offline/SARA_V6_PREVIEW_OFFLINE.html\`. El workflow entrega un artefacto llamado \`SARA-V6-PREVIEW\`. Para usarlo en una PC de otra persona basta descargar el archivo HTML o abrir el sitio de pruebas.

## Guion de exposición

Ver [GUIA_EXPOSICION_V6.md](./GUIA_EXPOSICION_V6.md). Contiene lo que debe decirse en cada capítulo y diferencia funciones actuales de propuestas.

## Control de publicación

GitHub Actions valida la rama de desarrollo y solicita una publicación combinada que compila **la raíz formal desde \`presentation-approved\`** y **la carpeta \`preview/\` desde \`development-v5\`**. Nunca se fusiona automáticamente la V6 a la versión formal. El cambio a versión aprobada requiere autorización explícita y validación de la exposición en pantalla/proyector.
