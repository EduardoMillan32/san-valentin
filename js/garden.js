/* --- SISTEMA DE LLUVIA (CANVAS) --- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

// Función para ajustar tamaño sin borrar necesariamente todo de golpe visualmente
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Inicializar
resizeCanvas();

// En móvil, el resize dispara muchas veces. Usamos un 'debounce' simple si quisieras, 
// pero para este efecto simple, solo reajustamos dimensiones.
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        // ... (resto del constructor igual) ...
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 12 + 8; // Un poco más pequeños para móvil
        this.speedY = Math.random() * 1.5 + 0.5; // Velocidad suave
        this.type = Math.random() > 0.5 ? '❤️' : '🌸';
        this.opacity = Math.random() * 0.5 + 0.3;
    }
    update() {
        this.y += this.speedY;
        // Reiniciar si sale de la pantalla
        if (this.y > canvas.height) {
            this.y = 0 - this.size;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.font = this.size + 'px serif';
        ctx.fillText(this.type, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}

function initRain() {
    for (let i = 0; i < 50; i++) { // Cantidad de partículas
        particlesArray.push(new Particle());
    }
}

function animateRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateRain);
}

// Iniciar animación
initRain();
animateRain();


/* --- SISTEMA DE JARDÍN (DOM) --- */
const gardenContainer = document.getElementById('garden-container');

function addFlowerToGarden(flowerData) {
    // 1. Crear el contenedor principal
    const container = document.createElement('div');
    container.classList.add('flower-container');

    // 2. Crear la cabeza de la flor
    const head = document.createElement('div');
    head.classList.add('flower-head');
    head.classList.add(`flower-type-${flowerData.type}`);

    if (flowerData.type === 2) {
        const tulipRight = document.createElement('div');
        tulipRight.classList.add('tulip-right');
        head.appendChild(tulipRight);
    }

    // 3. Aplicar colores dinámicos usando Variables CSS
    if (flowerData.color) {
        head.style.setProperty('--petal-color', flowerData.color);
    }
    if (flowerData.center) {
        head.style.setProperty('--center-color', flowerData.center);
    }

    // 4. Crear el tallo
    const stem = document.createElement('div');
    stem.classList.add('stem');
    
    // Aleatoriedad para que se vea natural
    const randomHeight = Math.floor(Math.random() * 40) + 60; // Tallo entre 60 y 100px
    stem.style.height = `${randomHeight}px`;

    // 5. Ensamblar
    container.appendChild(head);
    container.appendChild(stem);

    // 6. Posicionamiento en el jardín
    const randomLeft = Math.floor(Math.random() * 80) + 10; // Entre 10% y 90%
    const randomScale = (Math.random() * 0.5 + 0.8); // Escala entre 0.8 y 1.3

    container.style.left = `${randomLeft}%`;
    container.style.transform = `scale(${randomScale})`; // Nota: esto se mezcla con la animación CSS, cuidado.
    
    // Z-Index basado en la escala para profundidad (más grandes al frente)
    container.style.zIndex = Math.floor(randomScale * 100);

    // 7. Insertar en el DOM
    gardenContainer.appendChild(container);
}

// Marchitar todas las flores existentes
function witherAllFlowers() {
    // 1. Buscar todas las flores en el jardín
    const flowers = document.querySelectorAll('.flower-container');

    if (flowers.length === 0) return; // Si no hay flores, no hace nada

    // 2. Recorrerlas una por una
    flowers.forEach(flower => {
        // Quitar la animación de moverse con el viento para que se vea triste
        const head = flower.querySelector('.flower-head');
        if (head) head.style.animation = 'none';

        // Aplicar la clase de marchitarse (definida en CSS)
        flower.classList.add('withering');

        // 3. Limpieza: Cuando termine la animación (3 segundos), borrar el elemento del HTML
        flower.addEventListener('animationend', () => {
            flower.remove();
        }, { once: true }); // 'once: true' asegura que el evento solo se ejecute una vez
    });
}