// --- BASE DE DATOS DE LOS PANELES (Aquí configuras el texto de cada caja) ---
const panelData = {
    '01': {
        title: "CENTRO DE CONTROL",
        content: `
            <h2>CENTRO DE CONTROL DE COMUNICACIONES Y EMERGENCIAS</h2>
            <p>Área responsable del monitoreo y aviso de las alertas de tormentas eléctricas en toda la Mina.</p>
            <p style="margin-bottom: 1rem;">Se cuenta con 02 sistemas de detección de tormentas eléctricas:</p>
            
            <!-- NUEVOS PLANETAS (StrikeGuard y Keraunos) -->
            <div class="globes-container flow-globes">
                <!-- Planeta Izquierdo -->
                <div class="globe-wrapper" onclick="openPlanetInfo('strikeguard')" style="cursor: pointer;" title="Ver detalles de StrikeGuard">
                    <div class="hologram-globe">
                        <div class="globe-surface"></div>
                        <div class="globe-shine"></div>
                    </div>
                    <i class="fa-solid fa-satellite orbit-satellite"></i>
                    <h4 class="globe-text">STRIKEGUARD</h4>
                </div>

                <!-- Planeta Derecho -->
                <div class="globe-wrapper" onclick="openPlanetInfo('keraunos')" style="cursor: pointer;" title="Ver detalles de Keraunos">
                    <div class="hologram-globe">
                        <div class="globe-surface"></div>
                        <div class="globe-shine"></div>
                    </div>
                    <i class="fa-solid fa-satellite orbit-satellite delay-orbit"></i>
                    <h4 class="globe-text">KERAUNOS</h4>
                </div>
            </div>

            <!-- FLUJO NORMAL CON FLECHAS CORREGIDAS -->
            <div class="flow-container">
                <div class="flow-box">
                    <i class="fa-solid fa-satellite-dish"></i>
                    <h4>Monitoreo 24/7</h4>
                    <p>Monitoreo constante de las alertas de tormentas eléctricas en la mina.</p>
                </div>

                <!-- Flecha Normal 1 -->
                <div class="flow-arrow normal-arrow">
                    <i class="fa-solid fa-angles-right"></i>
                </div>

                <!-- Rayo Central -->
                <div class="flow-bolt">
                    <i class="fa-solid fa-bolt"></i>
                </div>

                <!-- Flecha Normal 2 -->
                <div class="flow-arrow normal-arrow">
                    <i class="fa-solid fa-angles-right"></i>
                </div>

                <div class="flow-box alert-box">
                    <i class="fa-solid fa-tower-broadcast"></i>
                    <h4>Emitir Alerta</h4>
                    <p>Emitir la alerta radial por las frecuencias tras la detección.</p>
                </div>
            </div>
        `
    },
    '02': {
        title: "PROBLEMÁTICA",
        content: `
            <h2 class="text-red"><i class="fa-solid fa-triangle-exclamation"></i> COLAPSO EN LAS COMUNICACIONES</h2>
            <p>Actualmente, el protocolo de alertas de tormentas presenta interrogantes en el personal de campo durante eventos de tormenta:</p>
            
            <div class="cycle-container">
                <!-- Anillo giratorio SVG -->
                <svg class="cycle-ring" viewBox="0 0 400 400">
                    <circle cx="200" cy="200" r="160" fill="none" stroke="var(--color-02-red)" stroke-width="2" stroke-dasharray="10 10" class="ring-dashed" />
                    <circle cx="200" cy="200" r="150" fill="none" stroke="#ffcc00" stroke-width="1" opacity="0.3" class="ring-solid" />
                </svg>

                <!-- Núcleo Central -->
                <div class="cycle-core">
                    <i class="fa-solid fa-rotate-right"></i>
                    <span>CICLO<br>DIARIO</span>
                </div>

                <!-- Nodos (Problemas) -->
                <div class="cycle-node node-top">
                    <h4>01. Mensaje Radial</h4>
                    <p>Alertas generales sin ubicación exacta.</p>
                </div>

                <div class="cycle-node node-bottom-right">
                    <h4>02. Saturación del Canal</h4>
                    <p>Radios y celulares colapsan por consultas.</p>
                </div>

                <div class="cycle-node node-bottom-left">
                    <h4>03. Desconocimiento</h4>
                    <p>Interfaz Keraunos poco amigable.</p>
                    
                    <!-- EL QR REGRESÓ -->
                    <div class="qr-icon-container" onclick="openHoloModal('https://qr.keraunos.co/t/mHMsMSjw7fLzlVFzMsh9K99cFG7tiC', 'APP KERAUNOS')" title="Proyectar Interfaz Keraunos">
                        <i class="fa-solid fa-qrcode"></i>
                    </div>
                </div>
            </div>
        `
    },
    '03': {
        title: "PROPUESTA - S.A.R.A",
        content: `
            <div class="sara-modal-header">
                <h1 class="sara-modal-title">S.A.R.A</h1>
                <h3 class="sara-modal-subtitle">SISTEMA DE ALERTA DE RAYOS ANTAMINA</h3>
                <p>S.A.R.A. transforma el caos del Centro de Control y las dudas del personal en campo en un mapa accesible e intuitivo.</p>
            </div>

            <!-- SECCIÓN DE FUSIÓN: LOS DOS MUNDOS -> S.A.R.A -->
            <div class="fusion-container">
                <!-- Planeta Izquierdo -->
                <div class="globe-wrapper">
                    <div class="hologram-globe">
                        <div class="globe-surface"></div>
                        <div class="globe-shine"></div>
                    </div>
                    <i class="fa-solid fa-satellite orbit-satellite"></i>
                    <h4 class="globe-text">STRIKE GUARD</h4>
                </div>

                <!-- Flujo de energía izquierdo (SVG) -->
                <div class="energy-flow">
                    <svg viewBox="0 0 100 50">
                        <path d="M 0 25 Q 50 10 100 25" fill="transparent" stroke="var(--color-03-cyan)" stroke-width="2" class="flow-line" />
                    </svg>
                </div>

                <!-- Núcleo Central S.A.R.A (Fusión) -->
                <div class="sara-core">
                    <div class="core-ring"></div>
                    <i class="fa-solid fa-bolt core-bolt" 
                       onclick="openHoloModal('https://antito-yanac.github.io/sara/', 'SISTEMA SARA')" 
                       title="Proyectar Interfaz S.A.R.A."></i>
                </div>

                <!-- Flujo de energía derecho (SVG) -->
                <div class="energy-flow">
                    <svg viewBox="0 0 100 50">
                        <path d="M 0 25 Q 50 40 100 25" fill="transparent" stroke="var(--color-03-cyan)" stroke-width="2" class="flow-line" />
                    </svg>
                </div>

                <!-- Planeta Derecho -->
                <div class="globe-wrapper">
                    <div class="hologram-globe">
                        <div class="globe-surface"></div>
                        <div class="globe-shine"></div>
                    </div>
                    <i class="fa-solid fa-satellite orbit-satellite delay-orbit"></i>
                    <h4 class="globe-text">KERAUNOS</h4>
                </div>
            </div>

            <p class="fusion-text">Tomamos lo bueno de ambos mundos y creamos un solo sistema unificado.</p>

            <!-- Engranaje del Sistema -->
            <div class="gears-container">
                <div class="gear-card">
                    <h4>Motor de Consultas</h4>
                    <p>Consulta continua alertando eventos al instante.</p>
                </div>
                
                <div class="gear-cluster">
                    <i class="fa-solid fa-gear gear-large"></i>
                    <i class="fa-solid fa-gear gear-small"></i>
                </div>
                
                <div class="gear-card">
                    <h4>Sombreado Automático</h4>
                    <p>Pinta dinámicamente las zonas afectadas según la alerta.</p>
                </div>
                
                <div class="gear-cluster">
                    <i class="fa-solid fa-gear gear-large"></i>
                    <i class="fa-solid fa-gear gear-small"></i>
                </div>
                
                <div class="gear-card">
                    <h4>Indexación GPS</h4>
                    <p>El trabajador verifica en tiempo real su zona de alerta.</p>
                </div>
            </div>
        `
    },
    '04': {
        title: "OPTIMIZACIÓN TÉCNICA",
        content: `
            <h2>Optimización</h2>

            <!-- DESAFÍO 01: LATENCIA -->
            <div class="challenge-container">
                <h3 class="challenge-title">Desafío 01: Latencia de Consulta</h3>
                <div class="challenge-flow">
                    <div class="challenge-box actual">
                        <h4>ACTUAL</h4>
                        <p>Riesgo de bloqueo de IP por polling excesivo (cada 20 segundos).</p>
                    </div>
                    
                    <div class="challenge-arrow">
                        <!-- NUEVA FLECHA 3D DOBLE -->
                        <svg viewBox="0 0 100 100" class="evo-arrow" preserveAspectRatio="xMidYMid meet">
                            <!-- Sombra/Base 3D -->
                            <polygon points="15,75 45,45 75,75 60,90 45,75 30,90" fill="#2a0b4e" transform="translate(2, 5)" />
                            <polygon points="45,75 75,45 105,75 90,90 75,75 60,90" fill="#2a0b4e" transform="translate(2, 5)" />
                            
                            <!-- Cuerpo de la Flecha (Morado) -->
                            <polygon points="15,75 45,45 75,75 60,90 45,75 30,90" fill="var(--color-04-purple)" />
                            <polygon points="45,75 75,45 105,75 90,90 75,75 60,90" fill="var(--color-04-purple)" />
                            
                            <!-- Brillo Superior (Cian para contraste) -->
                            <polygon points="45,45 75,75 60,90 45,75" fill="#fff" opacity="0.3" />
                            <polygon points="75,45 105,75 90,90 75,75" fill="#fff" opacity="0.3" />
                        </svg>
                    </div>

                    <div class="challenge-box solution">
                        <h4>SOLUCIÓN</h4>
                        <p>Integración de API Directa de Keraunos para recibir eventos en tiempo real (0 latencia).</p>
                    </div>
                </div>
            </div>

            <!-- DESAFÍO 02: SERVIDOR -->
            <div class="challenge-container">
                <h3 class="challenge-title">Desafío 02: Servidor de Prueba Local</h3>
                <div class="challenge-flow">
                    <div class="challenge-box actual">
                        <h4>ACTUAL</h4>
                        <p>Actualmente corre en una URL externa sin SSL corporativo. Riesgo de falta de confianza.</p>
                    </div>
                    
                    <div class="challenge-arrow">
                        <!-- NUEVA FLECHA 3D DOBLE -->
                        <svg viewBox="0 0 100 100" class="evo-arrow" preserveAspectRatio="xMidYMid meet">
                            <polygon points="15,75 45,45 75,75 60,90 45,75 30,90" fill="#2a0b4e" transform="translate(2, 5)" />
                            <polygon points="45,75 75,45 105,75 90,90 75,75 60,90" fill="#2a0b4e" transform="translate(2, 5)" />
                            
                            <polygon points="15,75 45,45 75,75 60,90 45,75 30,90" fill="var(--color-04-purple)" />
                            <polygon points="45,75 75,45 105,75 90,90 75,75 60,90" fill="var(--color-04-purple)" />
                            
                            <polygon points="45,45 75,75 60,90 45,75" fill="#fff" opacity="0.3" />
                            <polygon points="75,45 105,75 90,90 75,75" fill="#fff" opacity="0.3" />
                        </svg>
                    </div>

                    <div class="challenge-box solution">
                        <h4>SOLUCIÓN</h4>
                        <p>Migración directa a la Red Interna generando un dominio .antamina.com para infundir confianza.</p>
                    </div>
                </div>
            </div>
        `
    },
    '05': {
        title: "SISTEMA DE NOTIFICACIONES",
        content: `
            <h2>Alertar y Culturizar</h2>
            
            <div class="notif-diagonal-container">
                
                <!-- NODO 1: EFECTO BASURERO -->
                <div class="notif-node">
                    <div class="notif-circle">
                        <div class="orbit-line line-1"></div>
                        <div class="orbit-line line-2"></div>
                        <i class="fa-solid fa-bell main-notif-icon"></i>
                        <span class="notif-badge">50</span>
                    </div>
                    <div class="notif-text">
                        <h4>Evitar el "Efecto Basurero"</h4>
                        <p>No saturar al trabajador convirtiendo a S.A.R.A. en una app más que termine siendo ignorada.</p>
                    </div>
                </div>

                <!-- NODO 2: NOTIFICACIÓN PERSISTENTE -->
                <div class="notif-node">
                    <div class="notif-circle">
                        <div class="orbit-line line-1 reverse"></div>
                        <div class="orbit-line line-2 reverse"></div>
                        <i class="fa-solid fa-mobile-screen-button main-notif-icon"></i>
                        <i class="fa-solid fa-lock lock-icon"></i>
                    </div>
                    <div class="notif-text">
                        <h4>Notificación Persistente</h4>
                        <p>Alertas críticas que requieren confirmación y apagado manual por parte del usuario, dentro del sistema.</p>
                    </div>
                </div>

                <!-- NODO 3: CULTURA Y RESPUESTA (Con botón de proyección) -->
                <div class="notif-node">
                    <div class="notif-circle clickable-circle" 
                         onclick="openHoloModal('https://antito-yanac.github.io/sara/', 'SISTEMA SARA')" 
                         title="Proyectar Mapa S.A.R.A.">
                        <div class="orbit-line line-1"></div>
                        <div class="orbit-line line-2"></div>
                        <!-- El rayo con animación de pulso -->
                        <i class="fa-solid fa-bolt main-notif-icon sara-bolt-pulse"></i>
                    </div>
                    <div class="notif-text">
                        <h4>Cultura y Respuesta</h4>
                        <p>Involucra activamente al trabajador en la verificación de alertas de tormentas en su zona operativa.</p>
                    </div>
                </div>

            </div>
        `
    },
    '06': {
        title: "BLINDAJE Y MITIGACIÓN",
        content: `
            <h2 class="text-green"><i class="fa-solid fa-shield-halved"></i> Seguridad y Privacidad</h2>
            
            <div class="sec-top-container">
                <div class="sec-card floating-card">
                    <i class="fa-solid fa-key sec-icon"></i>
                    <h4>Ciberseguridad Compartida</h4>
                    <p>Integración auditada por Ciberseguridad Antamina. Gestor de secretos para API Keys.</p>
                </div>
                <div class="sec-card floating-card delay-card">
                    <i class="fa-solid fa-user-secret sec-icon"></i>
                    <h4>Privacidad Zero-Logging</h4>
                    <p>El sistema no almacena ubicaciones (Cumplimiento de la Ley N° 29733).</p>
                </div>
            </div>

            <h3 class="text-green" style="margin-top: 1.5rem; border-bottom: 1px solid rgba(0,255,136,0.3); padding-bottom: 5px;">Redundancia Operativa: Triple Capa de Respaldo</h3>
            
            <div class="sim-stage">
                <!-- EL MUNDO: Se mueve en conjunto -->
                <div class="sim-world" id="sim-world">
                    
                    <!-- Lienzo SVG -->
                    <svg class="lines-svg" viewBox="-100 -200 1000 500"> <!-- Ampliamos el ancho a 1000 -->
                        <!-- API -> Motores -->
                        <path id="line-api-m1" class="draw-path" d="M 0 0 Q 125 -100 250 -100" />
                        <path id="line-api-m2" class="draw-path" d="M 0 0 L 250 0" />
                        <path id="line-api-m3" class="draw-path" d="M 0 0 Q 125 100 250 100" />
                        
                        <!-- Motores -> Keraunos -->
                        <path id="line-m1-merge" class="draw-path" d="M 250 -100 Q 375 -100 500 0" />
                        <path id="line-m2-merge" class="draw-path" d="M 250 0 L 500 0" />
                        <path id="line-m3-merge" class="draw-path" d="M 250 100 Q 375 100 500 0" />
                        
                        <!-- Keraunos -> StrikeGuard (AHORA ES HORIZONTAL) -->
                        <path id="line-keraunos-strike" class="draw-path" d="M 555 0 L 695 0" />
                    </svg>

                    <!-- Nodos -->
                    <div class="sim-node api-node" id="sim-api" onclick="triggerApiFail()">
                        <i class="fa-solid fa-server"></i><span>API</span>
                        <div class="red-cross"><i class="fa-solid fa-xmark"></i></div>
                    </div>

                    <div class="sim-node motor-node" id="motor-1" onclick="triggerMotorFail(this)">
                        <i class="fa-solid fa-microchip"></i><span>MOTOR 01</span>
                        <div class="red-cross"><i class="fa-solid fa-xmark"></i></div>
                    </div>
                    <div class="sim-node motor-node" id="motor-2" onclick="triggerMotorFail(this)">
                        <i class="fa-solid fa-microchip"></i><span>MOTOR 02</span>
                        <div class="red-cross"><i class="fa-solid fa-xmark"></i></div>
                    </div>
                    <div class="sim-node motor-node" id="motor-3" onclick="triggerMotorFail(this)">
                        <i class="fa-solid fa-microchip"></i><span>MOTOR 03</span>
                        <div class="red-cross"><i class="fa-solid fa-xmark"></i></div>
                    </div>

                    <div class="sim-node operator-node" id="operator-keraunos" onclick="triggerKeraunosFail()">
                        <i class="fa-solid fa-headset"></i><span class="op-label">KERAUNOS<br>MANUAL</span>
                        <div class="red-cross"><i class="fa-solid fa-xmark"></i></div>
                    </div>

                    <div class="sim-node operator-node strike-color" id="operator-strike">
                        <i class="fa-solid fa-headset"></i><span class="op-label">STRIKE GUARD<br>MANUAL</span>
                        <div class="red-cross"><i class="fa-solid fa-xmark"></i></div>
                    </div>
                </div>
            </div>
        `
    }
};

// --- LÓGICA DE APERTURA DE MODALES ---

// Variable global para saber si ya presentamos S.A.R.A
let saraRevealed = false;
let currentOpenPanelId = null;

// --- ESTADO GLOBAL DE LA SIMULACIÓN (CARPETA 06) ---
let simState = {
    apiFailed: false,
    motorsFailed: [false, false, false],
    keraunosFailed: false
};

// Función para restaurar visualmente el estado al abrir el modal
function restoreSimulationState() {
    const simWorld = document.getElementById('sim-world');
    if (!simWorld) return;

    // Desactivar transiciones un momento para que aparezca instantáneo al abrir
    simWorld.style.transition = 'none';
    document.querySelectorAll('.draw-path').forEach(el => el.style.transition = 'none');
    document.querySelectorAll('.sim-node').forEach(el => el.style.transition = 'none');

    // 1. Restaurar API
    if (simState.apiFailed) {
        document.getElementById('sim-api').classList.add('disabled');
        document.getElementById('line-api-m1').classList.add('drawn');
        document.getElementById('line-api-m2').classList.add('drawn');
        document.getElementById('line-api-m3').classList.add('drawn');
        document.getElementById('motor-1').classList.add('appear');
        document.getElementById('motor-2').classList.add('appear');
        document.getElementById('motor-3').classList.add('appear');
        simWorld.classList.add('state-1');
    }

    // 2. Restaurar Motores
    if (simState.motorsFailed[0]) document.getElementById('motor-1').classList.add('disabled');
    if (simState.motorsFailed[1]) document.getElementById('motor-2').classList.add('disabled');
    if (simState.motorsFailed[2]) document.getElementById('motor-3').classList.add('disabled');

    // 3. Restaurar Keraunos (Si los 3 motores fallaron)
    if (simState.motorsFailed[0] && simState.motorsFailed[1] && simState.motorsFailed[2]) {
        simWorld.classList.remove('state-1');
        simWorld.classList.add('state-2');
        document.getElementById('line-m1-merge').classList.add('drawn');
        document.getElementById('line-m2-merge').classList.add('drawn');
        document.getElementById('line-m3-merge').classList.add('drawn');
        document.getElementById('operator-keraunos').classList.add('appear');
    }

    // 4. Restaurar StrikeGuard
    if (simState.keraunosFailed) {
        document.getElementById('operator-keraunos').classList.add('disabled');
        document.getElementById('line-keraunos-strike').classList.add('drawn');
        document.getElementById('operator-strike').classList.add('appear');
    }

    // Reactivar las transiciones después de que cargue
    setTimeout(() => {
        simWorld.style.transition = '';
        document.querySelectorAll('.draw-path').forEach(el => el.style.transition = '');
        document.querySelectorAll('.sim-node').forEach(el => el.style.transition = '');
    }, 100);
}

// --- LÓGICA DE APERTURA DE MODALES ---
function openPanelModal(panelId) {
    const data = panelData[panelId];
    if (!data) return;

    currentOpenPanelId = panelId;

    // Si el usuario abre la carpeta 03, activamos la bandera
    if (panelId === '03') {
        saraRevealed = true;
    }

    const modal = document.getElementById('holoModal');
    const modalContent = document.querySelector('.holo-modal-content');
    const titleElement = document.getElementById('holoTitle');
    const iframeContainer = document.getElementById('holoIframeContainer');
    const htmlContainer = document.getElementById('holoHtmlContainer');
    const dynamicContent = document.getElementById('dynamicContent');

    // Lógica de colores
    modalContent.className = 'holo-modal-content'; 
    modalContent.classList.add(`theme-${panelId}`); 

    titleElement.innerHTML = `<i class="fa-solid fa-folder-open"></i> CARPETA ${panelId}: ${data.title}`;
    dynamicContent.innerHTML = data.content;

    if (panelId === '06') {
        restoreSimulationState();
    }

    iframeContainer.classList.add('hidden');
    htmlContainer.classList.remove('hidden');
    document.getElementById('holoIframe').src = '';

    modal.classList.add('active');
}

function openHoloModal(url, title) {
    const modal = document.getElementById('holoModal');
    const modalContent = document.querySelector('.holo-modal-content');
    const titleElement = document.getElementById('holoTitle');
    const iframeContainer = document.getElementById('holoIframeContainer');
    const htmlContainer = document.getElementById('holoHtmlContainer');
    const iframe = document.getElementById('holoIframe');

    // Limpiamos temas y volvemos al cyan por defecto para las webs
    modalContent.className = 'holo-modal-content theme-03'; 

    // Configurar título
    titleElement.innerHTML = `<i class="fa-solid fa-satellite-dish"></i> ${title}`;
    
    // Configurar iframe
    iframe.src = 'about:blank'; 
    setTimeout(() => { iframe.src = url; }, 50);

    // Ocultar HTML, mostrar iframe
    htmlContainer.classList.add('hidden');
    iframeContainer.classList.remove('hidden');

    // Mostrar modal
    modal.classList.add('active');
}

function closeHoloModal() {
    const modal = document.getElementById('holoModal');
    const iframe = document.getElementById('holoIframe');
    
    modal.classList.remove('active');
    setTimeout(() => { iframe.src = ''; }, 400);

    if (currentOpenPanelId) {
        const panelMap = {
            '01': 'panel-portada',
            '02': 'panel-problematica',
            '03': 'panel-solucion',
            '04': 'panel-hoja',
            '05': 'panel-notificaciones',
            '06': 'panel-mitigacion'
        };
        const panelElement = document.getElementById(panelMap[currentOpenPanelId]);
        if (panelElement) {
            panelElement.classList.remove('locked'); // Quita la cortina
        }

        // --- NUEVA LÓGICA: Mostrar Botón SOS al cerrar la Carpeta 06 ---
        if (currentOpenPanelId === '06') {
            const sosBtn = document.getElementById('sos-button');
            if (sosBtn && !sosBtn.classList.contains('visible')) {
                setTimeout(() => {
                    sosBtn.classList.add('visible');
                }, 800); // Espera a que el modal termine de cerrarse
            }
        }

        currentOpenPanelId = null; // Resetea la variable
    }

    // --- NUEVA LÓGICA: Mostrar S.A.R.A en la interfaz principal ---
    if (saraRevealed) {
        const saraHud = document.getElementById('sara-main-hud');
        // Si no tiene la clase visible, se la ponemos con un pequeño delay
        if (saraHud && !saraHud.classList.contains('visible')) {
            setTimeout(() => {
                saraHud.classList.add('visible');
            }, 400); // Espera a que el modal termine de cerrarse
        }
    }
}

// Cerrar modal con clic fuera o ESC
document.getElementById('holoModal').addEventListener('click', function(e) {
    if (e.target === this) closeHoloModal();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeHoloModal();
});

// --- FUNCIONES EXISTENTES ---
function startSystem() {
    document.getElementById('intro-screen').classList.add('hidden');
    setTimeout(() => {
        document.getElementById('hud-dashboard').classList.remove('hidden');
    }, 500);
}

// =========================================
// LÓGICA DE SIMULACIÓN DE REDUNDANCIA V6 (CON MEMORIA)
// =========================================
let motorsDownCount = 0;

function triggerApiFail() {
    const apiNode = document.getElementById('sim-api');
    const simWorld = document.getElementById('sim-world');
    if (apiNode.classList.contains('disabled')) return;

    simState.apiFailed = true; // Guardar estado
    apiNode.classList.add('disabled');
    simWorld.classList.add('state-1');

    setTimeout(() => {
        document.getElementById('line-api-m1').classList.add('drawn');
        setTimeout(() => document.getElementById('motor-1').classList.add('appear'), 500);
    }, 300);

    setTimeout(() => {
        document.getElementById('line-api-m2').classList.add('drawn');
        setTimeout(() => document.getElementById('motor-2').classList.add('appear'), 500);
    }, 1200);

    setTimeout(() => {
        document.getElementById('line-api-m3').classList.add('drawn');
        setTimeout(() => document.getElementById('motor-3').classList.add('appear'), 500);
    }, 2100);
}

function triggerMotorFail(motorNode) {
    if (motorNode.classList.contains('disabled')) return;
    motorNode.classList.add('disabled');
    
    // Guardar qué motor falló
    const motorId = parseInt(motorNode.id.replace('motor-', '')) - 1;
    simState.motorsFailed[motorId] = true;
    
    motorsDownCount++;

    if (motorsDownCount === 3) {
        const simWorld = document.getElementById('sim-world');
        simWorld.classList.remove('state-1');
        simWorld.classList.add('state-2'); 
        
        setTimeout(() => document.getElementById('line-m1-merge').classList.add('drawn'), 300);
        setTimeout(() => document.getElementById('line-m2-merge').classList.add('drawn'), 800);
        setTimeout(() => document.getElementById('line-m3-merge').classList.add('drawn'), 1300);

        setTimeout(() => {
            document.getElementById('operator-keraunos').classList.add('appear');
        }, 2200);
    }
}

function triggerKeraunosFail() {
    const keraunosNode = document.getElementById('operator-keraunos');
    if (keraunosNode.classList.contains('disabled')) return;

    simState.keraunosFailed = true; // Guardar estado
    keraunosNode.classList.add('disabled');

    document.getElementById('line-keraunos-strike').classList.add('drawn');

    setTimeout(() => {
        document.getElementById('operator-strike').classList.add('appear');
    }, 1500);
}

// =========================================
// LÓGICA DE MODALES PEQUEÑOS (CARPETA 01)
// =========================================
let planetTypewriterTimeout;

const planetData = {
    'strikeguard': "SISTEMA REACTIVO, ENVÍA ALERTAS EN CUANTO REGISTRE UN RAYO DE NUBE A TIERRA.",
    'keraunos': "SISTEMA PREDICTIVO, CALCULA EL UMBRAL DEL CAMPO ELECTROMAGNÉTICO EN UN RANGO EL SENSOR FÍSICO INSTALADO Y EMITE UNA ALERTA ANTE UNA POSIBLE DESCARGA ELÉCTRICA."
};

function openPlanetInfo(type) {
    const modal = document.getElementById('planetModal');
    const titleElement = document.getElementById('planetTitle');
    const outputElement = document.getElementById('planet-typewriter-output');

    // Configurar título
    titleElement.innerHTML = `<i class="fa-solid fa-satellite-dish"></i> INFORMACIÓN: ${type.toUpperCase()}`;
    
    // Limpiar texto anterior
    outputElement.innerHTML = '';
    if (planetTypewriterTimeout) clearTimeout(planetTypewriterTimeout);

    // Mostrar modal (sin cerrar el de atrás)
    modal.classList.add('active');

    // Efecto Máquina de Escribir
    const textToType = planetData[type];
    let i = 0;

    function typeCharacter() {
        if (i < textToType.length) {
            outputElement.innerHTML += textToType.charAt(i);
            i++;
            planetTypewriterTimeout = setTimeout(typeCharacter, 30); 
        }
    }
    // Pequeño delay para que el modal termine de abrirse antes de escribir
    setTimeout(typeCharacter, 300); 
}

function closePlanetModal() {
    const modal = document.getElementById('planetModal');
    modal.classList.remove('active');
    if (planetTypewriterTimeout) clearTimeout(planetTypewriterTimeout);
}

// Cerrar el modal pequeño si se hace clic fuera de él
document.getElementById('planetModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closePlanetModal();
    }
});

// =========================================
// LÓGICA DEL BOTÓN SOS
// =========================================
function triggerSOS() {
    // 1. Efecto de flash de pantalla roja
    const flash = document.getElementById('lightning-flash');
    if(flash) {
        flash.style.background = 'rgba(255, 0, 60, 0.6)'; // Rojo en lugar de cyan
        flash.classList.add('flash-active');
        
        setTimeout(() => {
            flash.classList.remove('flash-active');
            // Restaurar el color original del relámpago después de un segundo
            setTimeout(() => { flash.style.background = 'rgba(180, 240, 255, 0.4)'; }, 500);
        }, 300);
    }
    
    console.log("🚨 ALERTA SOS ACTIVADA: Protocolo StrikeGuard Manual iniciado.");
}