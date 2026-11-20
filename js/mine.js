const canvas = document.getElementById('mineCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- PARÁMETROS DEL TAJO ---
const NUM_LEVELS = 12;       
const MAX_RADIUS = 400;      
const MIN_RADIUS = 40;       
const LEVEL_DEPTH = 25;      

const trucks = [];

// --- CLASE CAMIÓN (Puntos grandes) ---
class Truck {
    constructor(level) {
        this.level = level;
        this.radius = MAX_RADIUS - (level * ((MAX_RADIUS - MIN_RADIUS) / NUM_LEVELS));
        this.y = level * LEVEL_DEPTH;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1);
        this.size = Math.random() * 2.5 + 2; 
        this.color = Math.random() > 0.3 ? '#ffcc00' : '#00f3ff'; // Amarillo o Cyan
    }
    update() { this.angle += this.speed; }
    draw(rotX, rotY) {
        const x = Math.cos(this.angle) * this.radius;
        const z = Math.sin(this.angle) * this.radius;
        const y = this.y;

        const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
        let x1 = x * cosY - z * sinY;
        let z1 = z * cosY + x * sinY;

        const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        let y1 = y * cosX - z1 * sinX;
        let z2 = z1 * cosX + y * sinX;

        const fov = 800;
        const scale = fov / (fov + z2 + 700);
        const projX = width / 2 + x1 * scale;
        const projY = height / 2 + y1 * scale + 80;

        if (scale > 0) {
            ctx.shadowBlur = 12 * scale;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(projX, projY, this.size * scale, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
}

for (let i = 0; i < NUM_LEVELS; i++) {
    for (let j = 0; j < 4; j++) trucks.push(new Truck(i));
}

// --- SISTEMA DE LLUVIA ---
const raindrops = [];
const NUM_RAIN = 150;
for (let i = 0; i < NUM_RAIN; i++) {
    raindrops.push({
        x: Math.random() * width * 1.5 - width * 0.25, // Un poco más ancho para el ángulo
        y: Math.random() * height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 8 + 12
    });
}

function drawRain() {
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    raindrops.forEach(drop => {
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.length * 0.3, drop.y + drop.length); // Ángulo diagonal
        drop.y += drop.speed;
        drop.x -= drop.speed * 0.3;
        
        if (drop.y > height) {
            drop.y = -drop.length;
            drop.x = Math.random() * width * 1.5; // Resetear arriba
        }
    });
    ctx.stroke();
}

// --- REJILLA DE PERSPECTIVA (Base del Tajo) ---
function drawGrid(rotX, rotY) {
    const gridY = NUM_LEVELS * LEVEL_DEPTH; // Altura del fondo del tajo
    const gridSize = MAX_RADIUS * 1.5;      // Tamaño de la rejilla
    const segments = 20;

    ctx.strokeStyle = 'rgba(0, 243, 255, 0.1)';
    ctx.lineWidth = 1;

    for (let i = -segments/2; i <= segments/2; i++) {
        // Líneas Z
        ctx.beginPath();
        for (let j = -segments/2; j <= segments/2; j++) {
            const x = i * (gridSize / segments);
            const z = j * (gridSize / segments);
            
            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
            let x1 = x * cosY - z * sinY;
            let z1 = z * cosY + x * sinY;

            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
            let y1 = gridY * cosX - z1 * sinX;
            let z2 = z1 * cosX + gridY * sinX;

            const fov = 800;
            const scale = fov / (fov + z2 + 700);
            const projX = width / 2 + x1 * scale;
            const projY = height / 2 + y1 * scale + 80;

            if (j === -segments/2) ctx.moveTo(projX, projY);
            else ctx.lineTo(projX, projY);
        }
        ctx.stroke();
    }
}

// --- DIBUJAR ESTRUCTURA DEL TAJO ---
function drawMineStructure(rotX, rotY) {
    ctx.lineWidth = 1;
    for (let i = 0; i < NUM_LEVELS; i++) {
        const radius = MAX_RADIUS - (i * ((MAX_RADIUS - MIN_RADIUS) / NUM_LEVELS));
        const y = i * LEVEL_DEPTH;
        const alpha = 0.6 - (i * 0.04); 
        ctx.strokeStyle = `rgba(0, 243, 255, ${alpha})`;

        ctx.beginPath();
        const segments = 60;
        for (let j = 0; j <= segments; j++) {
            const angle = (j / segments) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
            let x1 = x * cosY - z * sinY;
            let z1 = z * cosY + x * sinY;

            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
            let y1 = y * cosX - z1 * sinX;
            let z2 = z1 * cosX + y * sinX;

            const fov = 800;
            const scale = fov / (fov + z2 + 700);
            const projX = width / 2 + x1 * scale;
            const projY = height / 2 + y1 * scale + 80;

            if (j === 0) ctx.moveTo(projX, projY);
            else ctx.lineTo(projX, projY);
        }
        ctx.stroke();
    }
}

// --- CONTROL DE CÁMARA (CLICK Y ARRASTRAR) ---
let rotY = 0;
let rotX = 0.5; 
let isDragging = false;
let mouseX = 0, mouseY = 0;

// Escuchar en toda la ventana para que funcione en cualquier parte del fondo
window.addEventListener('pointerdown', (e) => {
    // Verificamos si el clic fue en un panel o botón. Si es así, ignoramos la rotación.
    if (e.target.closest('.hud-panel') || e.target.closest('.holo-modal-content') || e.target.closest('#intro-screen')) {
        return;
    }
    
    isDragging = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
    canvas.style.cursor = 'grabbing';
});

window.addEventListener('pointermove', (e) => {
    if (isDragging) {
        let deltaX = e.clientX - mouseX;
        let deltaY = e.clientY - mouseY;
        rotY += deltaX * 0.005;
        rotX += deltaY * 0.005;
        rotX = Math.max(0.1, Math.min(Math.PI / 2.5, rotX)); // Limitar inclinación
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
});

window.addEventListener('pointerup', () => {
    isDragging = false;
    canvas.style.cursor = 'grab';
});

// --- SISTEMA DE RELÁMPAGOS ---
function triggerLightning() {
    const flashDiv = document.getElementById('lightning-flash');
    if (flashDiv) flashDiv.classList.add('flash-active');

    // --- Disparar los rayos laterales ---
    const paths = document.querySelectorAll('.lightning-path');
    paths.forEach(path => {
        // 1. Quitamos la clase para reiniciar el estado
        path.classList.remove('strike');
        
        // 2. Usamos un mini-retraso para asegurar que el navegador procese el reinicio
        setTimeout(() => {
            path.classList.add('strike'); // 3. Volvemos a activar la animación
        }, 20); 
    });

    // Quitar el destello de la pantalla
    setTimeout(() => {
        if (flashDiv) flashDiv.classList.remove('flash-active');
    }, 200);

    // Programar el siguiente rayo en un tiempo aleatorio (2 a 6 segundos)
    setTimeout(triggerLightning, Math.random() * 4000 + 2000);
}

// Iniciar ciclo de relámpagos cuando el sistema arranca
document.getElementById('intro-screen').addEventListener('click', () => {
    setTimeout(triggerLightning, 1000);
});


// --- BUCLE DE ANIMACIÓN ---
function animate() {
    // Limpiar fondo semitransparente para dejar estela
    ctx.fillStyle = 'rgba(3, 3, 8, 0.3)';
    ctx.fillRect(0, 0, width, height);

    if (!isDragging) rotY += 0.001; // Auto-rotación suave

    // 1. Dibujar Rejilla Base
    drawGrid(rotX, rotY);

    // 2. Dibujar Tajo (Terrazas)
    drawMineStructure(rotX, rotY);

    // 3. Dibujar Camiones (Ordenados por Z)
    trucks.sort((a, b) => {
        const zA = Math.sin(a.angle) * a.radius;
        const zB = Math.sin(b.angle) * b.radius;
        return zB - zA; 
    });
    trucks.forEach(truck => {
        truck.update();
        truck.draw(rotX, rotY);
    });

    // 4. Dibujar Lluvia (Al final para que quede por encima)
    drawRain();

    requestAnimationFrame(animate);
}

animate();