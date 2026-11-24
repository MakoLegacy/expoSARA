# S.A.R.A. V6 — Guion ejecutivo de exposición
Sistema de Alerta y Respuesta Antamina

**Audiencia:** Presidencia y Vicepresidencias de Antamina.  
**Propósito:** solicitar respaldo para un piloto controlado, no aprobación inmediata de uso como canal único de alertamiento.  
**Duración orientativa:** 9–11 minutos, excluyendo demostración y preguntas.

## 01 — Contexto operacional
**En pantalla:** «De la detección a la decisión». StrikeGuard, Keraunos y «Detección → Monitoreo 24/7 → Aviso radial».

**Expón:** (En Antamina contamos con sistemas especializados para monitorear tormentas eléctricas. Desde el Centro de Control se realiza el seguimiento y se comunican las alertas por los canales oficiales. Junto con mi compañero nos preguntamos cómo aprovechar mejor esa información, sin reemplazar los sistemas existentes. De allí nace S.A.R.A., Sistema de Alerta y Respuesta Antamina.)

## 02 — Problemática
**En pantalla:** «La alerta se comunica. ¿Se comprende su alcance?». Avisos radiales, consultas adicionales, comprensión por zona.

**Expón:** (Los mensajes radiales son el mecanismo oficial. Pero para el personal de campo puede surgir una pregunta inmediata: ¿qué nivel de alerta corresponde a mi zona? Hoy no contamos con una práctica formal general de consulta meteorológica previa a la salida a campo; los trabajadores dependen de las comunicaciones del Centro de Control. Identificamos la oportunidad de complementar esos canales con una consulta simple, por zona, sin descalificar las herramientas actuales.)

## 03 — Solución
**En pantalla:** «Cuatro zonas. Una lectura más clara». Yanacancha, Oficinas Mina, Tajo y Tucush. Acceso a S.A.R.A.

**Expón:** (S.A.R.A. pone la información de la alerta por zona en una interfaz web más intuitiva. No detecta rayos ni predice el clima. Transforma la información disponible de Keraunos en una consulta fácil de comprender. Ahora les mostraremos un ejemplo del mapa. El sistema complementa los avisos y las instrucciones oficiales; nunca debe entenderse como sustituto.)

**Demostración:** abrir S.A.R.A. en una pestaña nueva. Verificar que la conexión esté disponible y distinguir alerta real de ejemplo.

## 04 — Ingeniería aplicada
**En pantalla:** «No creamos otro detector». Web Keraunos → tres motores (tres computadoras) → S.A.R.A. → campo.

**Expón:** (Desarrollamos tres scripts o motores instalados en tres computadoras. Cada uno consulta el estado de alertas de la web de Keraunos para cuatro zonas. S.A.R.A. utiliza esos resultados para una lectura más clara. Los tres motores ofrecen redundancia de consulta, pero comparten la misma fuente. Como evolución, buscamos evaluar el uso de una API oficial como vía principal y los motores web como respaldo. Esa arquitectura API todavía es una propuesta, no una integración ya ejecutada.)

## 05 — Cultura preventiva
**En pantalla:** «Alertar. Involucrar». Antes: consultar. Durante: mantenerse informado. Ante una alerta: responder.

**Expón:** (Aquí vemos una oportunidad que va más allá de la interfaz. Hoy los trabajadores no tienen una práctica formal establecida de consultar condiciones de tormenta antes de salir a campo. Nuestra propuesta es fomentar voluntariamente esa consulta previa como hábito preventivo, siempre con el apoyo de las áreas responsables. La web hoy muestra la información y los avisos cuando el usuario ingresa; no envía notificaciones en segundo plano como una aplicación móvil. Por eso la revisión previa no garantiza información durante toda la jornada: el personal debe seguir atento a la radio y cumplir los procedimientos. Queremos fortalecer la participación del trabajador, no trasladarle toda la responsabilidad del alertamiento.)

## 06 — Valor para Antamina
**En pantalla:** «Más claridad. Más visibilidad operativa». Centro de Control, personal de campo, operación y liderazgo.

**Expón:** (El valor esperado se distribuye en tres niveles: facilitar la consulta para el Centro de Control, mejorar la comprensión por zona para el trabajador y abrir una oportunidad de estandarización para la operación. Pero no mostraremos porcentajes de reducción ni beneficios como hechos logrados sin mediciones. Lo correcto es validarlos durante un piloto con indicadores concretos: concordancia con Keraunos, antigüedad del último dato, tiempo de comprensión y recurrencia de consultas al Centro de Control.)

## 07 — Continuidad y visión
**En pantalla:** «De una iniciativa operativa a una capacidad confiable». Validar → Fortalecer → Escalar.

**Expón:** (S.A.R.A. nació desde el conocimiento directo del proceso. Ahora buscamos evaluar su viabilidad institucional con participación de Centro de Control, Seguridad y Salud, Tecnología, Ciberseguridad y las áreas responsables. El próximo paso no es reemplazar canales ni desplegar a toda la operación: es un piloto controlado. Con el patrocinio de las áreas correspondientes, podríamos validar los datos, fortalecer seguridad e integración, y explorar a futuro funciones de respuesta a emergencias. Solicitamos apoyo para evaluar esa posibilidad y definir criterios de éxito.)

**Detalle opcional si preguntan:** abrir «Explorar respaldos». Secuencia hipotética API Keraunos → tres motores web → Keraunos manual → StrikeGuard manual. Aclarar que API todavía no está integrada y que los motores consultan la misma fuente.

## Reglas del discurso

- Diferenciar siempre **actual**, **propuesto**, **a validar**.
- No prometer alertas push en segundo plano, ni que el trabajador se mantiene informado solo por haber consultado antes de salir.
- No presentar cambios de protocolo ni obligaciones nuevas como aprobados.
- No criticar sistemas existentes ni atribuir disminuciones de incidentes o consultas sin indicadores medidos.
- Enfatizar que S.A.R.A. complementa las comunicaciones y los procedimientos oficiales.


## V6.1 — Sincronizar animaciones con el discurso

Las animaciones de entrada de cada capítulo duran unos segundos y finalizan sin requerir seguir moviendo el scroll. Después se activa una secuencia de motion graphics **independiente y repetitiva**, con una pausa entre ciclos. No representa información en vivo.

**Control del expositor:** el botón circular **↻** (abajo a la derecha) o la tecla **R** repiten la animación de la pantalla actual. Las flechas y la rueda avanzan o retroceden entre capítulos completos. Los enlaces y la simulación opcional funcionan como antes. En equipos con preferencia de movimiento reducido, la secuencia secundaria no se reproduce.

**01 · Contexto:** al explicar los sistemas, la trayectoria luminosa avanza **detección → monitoreo → aviso radial**. No implica transmisión radial simulada real.

**02 · Problemática:** una señal explicativa viaja desde la comunicación hacia la pregunta **¿qué sucede en mi zona?**. La secuencia no indica fallo de las radios; representa la necesidad de una lectura complementaria.

**03 · Solución:** se iluminan sucesivamente las cuatro zonas. Es un esquema, **no reproduce alertas ni códigos de color vigentes**.

**04 · Ingeniería:** pulsos de datos recorren el esquema **web Keraunos → tres motores → S.A.R.A.**. Es un diagrama de flujo ilustrativo. La consulta real tiene fuente común y se realiza mediante los scripts existentes.

**05 · Cultura:** se destaca secuencialmente **antes de salir: consultar**, **durante: escuchar avisos oficiales**, **ante la alerta: responder**. Se ilumina el aviso *dentro de la web*, sin falsas notificaciones push.

**06 · Valor:** el indicador vertical resalta uno por uno los posibles beneficios para las tres audiencias. No aparecen métricas inventadas.

**07 · Futuro:** se iluminan **validar → fortalecer → escalar** y se dibuja el símbolo final de tres diagonales de S.A.R.A.

**Recomendación de uso:** avanzar al capítulo, dejar concluir la entrada cinematográfica, introducir el mensaje, y utilizar **R** cuando quieras que la ilustración vuelva a recorrer el concepto central. Evitar accionar las animaciones de manera continua si distrae del mensaje.
