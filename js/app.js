/* --- js/app.js --- */

// Referencias
const input = document.getElementById('code-input');
const btnCheck = document.getElementById('plant-btn'); 
const feedback = document.getElementById('feedback-msg');
const modalOverlay = document.getElementById('modal-overlay');
const modalMsg = document.getElementById('modal-message');
const btnAccept = document.getElementById('btn-accept');
const btnReject = document.getElementById('btn-reject');

// Estado
let currentLevel = 1; 
let visualDeck = []; 
let pendingFlowersList = []; 
let pendingHint = "";     
let isLastOne = false;

// Colores
const COLOR_PALETTES = [
    { name: 'Blanco', color: '#ffffff', center: '#ffeb3b' },
    { name: 'Rosa',   color: '#ff4081', center: null },
    { name: 'Rojo',   color: '#d50000', center: null },
    { name: 'Dorado', color: '#ffd700', center: '#ff6b6b' },
    { name: 'Violeta', color: '#9c27b0', center: null },
    { name: 'Azul',   color: '#2196f3', center: '#ffeb3b' }
];

function getFlowersPerLevel() {
    // Si el ancho de la ventana es menor o igual a 768 pixeles (Celulares y Tablets pequeñas)
    if (window.innerWidth <= 768) {
        return 3; // <-- Flores para CELULAR
    } else {
        return 7; // <-- Flores para COMPUTADORA
    }
}

// Baraja
function buildDeck() {
    let availableTypes = [1, 2, 3, 4];
    let availableColors = [...COLOR_PALETTES];
    availableTypes.sort(() => Math.random() - 0.5);
    availableColors.sort(() => Math.random() - 0.5);

    availableTypes.forEach(type => {
        let selectedColor = null;
        if (type === 4) { selectedColor = null; } 
        else if (type === 3) {
            const safeIndex = availableColors.findIndex(c => c.name !== 'Dorado');
            selectedColor = (safeIndex !== -1) ? availableColors.splice(safeIndex, 1)[0] : availableColors.pop();
        } else {
            if (availableColors.length === 0) availableColors = [...COLOR_PALETTES];
            selectedColor = availableColors.pop();
        }
        visualDeck.push({ type: type, colorData: selectedColor });
    });
}

function getNextVisual() {
    if (visualDeck.length === 0) buildDeck();
    return visualDeck.pop();
}


// --- EVENTOS ---
btnCheck.addEventListener('click', checkCode);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkCode();
});

// --- BOTÓN ACEPTAR (EL GRAN FINAL O NORMAL) ---
btnAccept.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    
    if (isLastOne) {
        // ¡GRAN FINAL! Explosión de flores
        launchFlowerExplosion();
    } else {
        // Nivel normal: planta una flor
        if (pendingFlowersList.length > 0) {
            pendingFlowersList.forEach(flower => {
                addFlowerToGarden(flower);
            });
            pendingFlowersList = [];
        }
    }

    // Mostrar pista de abajo (si hay)
    if (pendingHint) {
        showFeedback(pendingHint, "#d63384");
        pendingHint = "";
    }
});


// --- BOTÓN RECHAZAR (EL DRAMA) ---
btnReject.addEventListener('click', () => {
    modalOverlay.classList.add('hidden'); 
    
    // 1. LLAMAMOS A LA FUNCIÓN DE MARCHITAR (en garden.js)
    witherAllFlowers();
    
    // 2. Mensaje dramático
    showFeedback("¡Oh no! 💔 Tu rechazo ha marchitado el jardín... Inténtalo de nuevo.", "red");
    
    // 3. Tiene que volver a intentarlo
    currentLevel--; 
});


// --- LÓGICA DE VALIDACIÓN ---
function checkCode() {
    const code = input.value.trim().toUpperCase(); 
    if (code === '') return;

    if (GAME_DATA[code]) {
        const data = GAME_DATA[code];
        if (data.order === currentLevel) {
            successEffect(code, data);
        } else if (data.order < currentLevel) {
            showFeedback("¡Esa flor ya la plantaste mi amor! ❤️", "orange");
        } else {
            const randomAhead = AHEAD_MSGS[Math.floor(Math.random() * AHEAD_MSGS.length)];
            
            showFeedback(randomAhead, "#2196f3");
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 500);
        }
    } else {
        failEffect();
    }
}

function successEffect(code, data) {
    currentLevel++; 
    feedback.classList.add('hidden');
    input.value = '';
    const flowersToPlant = getFlowersPerLevel();

    pendingFlowersList = [];

    for (let i = 0; i < flowersToPlant; i++) {
        const visual = getNextVisual(); // ¡Saca una carta nueva cada vez!
        
        const flowerData = {
            type: visual.type,
            color: visual.colorData ? visual.colorData.color : null,
            center: visual.colorData ? visual.colorData.center : null
        };
        
        // La guardamos en la lista
        pendingFlowersList.push(flowerData);
    }

    pendingHint = data.hint; 
    isLastOne = data.isFinal;

    // Configurar botones del modal
    if (isLastOne) {
        btnReject.classList.remove('hidden'); 
        btnAccept.textContent = "Aceptar 🌹";
    } else {
        btnReject.classList.add('hidden'); 
        btnAccept.textContent = "Aceptar 🌹";
    }

    modalMsg.textContent = data.message; 
    modalOverlay.classList.remove('hidden');
}

function failEffect() {
    const ui = document.querySelector('.ui-container');
    ui.classList.add('shake');
    setTimeout(() => ui.classList.remove('shake'), 500);
    const randomAhead = ERROR_MSGS[Math.floor(Math.random() * ERROR_MSGS.length)];
    showFeedback(randomAhead, "#888");
}

function showFeedback(text, color) {
    feedback.innerHTML = text;
    feedback.style.color = color;
    feedback.classList.remove('hidden');
}

// --- NUEVA FUNCIÓN: EXPLOSIÓN FINAL ---
function launchFlowerExplosion() {
    // 1. Plantar la flor principal (el Girasol final)
    if (pendingFlowersList.length > 0) {
        addFlowerToGarden(pendingFlowersList[0]);
    }

    // 2. Plantar muchas flores extra rápidamente
    let count = 0;
    const totalFlowers = 30; // Cantidad de flores extra

    const interval = setInterval(() => {
        // Obtener datos visuales aleatorios de la baraja
        const visual = getNextVisual();
        const flowerData = {
            type: visual.type,
            color: visual.colorData ? visual.colorData.color : null,
            center: visual.colorData ? visual.colorData.center : null
        };
        
        addFlowerToGarden(flowerData); // Plantar

        count++;
        if (count >= totalFlowers) {
            clearInterval(interval); // Detener el ciclo
            launchCelebrationText(); // Mostrar texto final al terminar
        }
    }, 150); // Plantar una flor cada 150ms (ajusta este número si lo quieres más rápido/lento)
}

function launchCelebrationText() {
    setTimeout(() => {
        const h1 = document.querySelector('h1');
        h1.textContent = "¡Te Amo Mucho! Feliz San Valentín ❤️";
        h1.style.animation = "pulse-glow 1s infinite alternate";
        feedback.classList.add('hidden'); // Ocultar pista final para limpiar
    }, 1000);
}

// Iniciar
buildDeck();
showFeedback("¡Bienvenida amor! ❤️ <br> Tu primera pista es: Tu sentido arácnido debe empezar a zumbar. Busca detrás del héroe que se columpia.", "#d63384");