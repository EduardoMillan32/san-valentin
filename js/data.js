/* --- js/data.js --- */
const GAME_DATA = {
    '1': {
        order: 1,
        message: "Tu risa ilumina mis días. ❤️", 
        hint: "Tu siguiente pista está donde hace frío 🧊"
    },
    '2': {
        order: 2,
        message: "Tu le das sentido a mi vida. 🌸",
        hint: "Busca entre tus libros favoritos 📚"
    },
    '3': {
        order: 3,
        message: "Tu brillo tan hermoso. ✨",
        hint: "Revisa debajo de tu almohada 🛏️"
    },
    '4': {
        order: 4,
        message: "¡Te amo infinitamente! Gracias por ser tú. 🌹",
        hint: "El regalo final está en mi mochila 🎒",
        isFinal: true
    }
};

// Mensajes de error
const ERROR_MSGS = ["Intenta de nuevo amor ❤️", "Ese no es 🤭 <br> busca bien "];
const AHEAD_MSGS = ["¡Te adelantaste! 🙈 Guarda este para después.", "Ese es del futuro ⏳. Busca la pista anterior."];

// NUEVO: La pista para que encuentre el PRIMER papelito (el que tiene el código INICIO)
const START_HINT = "¡Bienvenida amor! ❤️ <br> Tu primera pista es: Debajo del teclado de la computadora ⌨️";