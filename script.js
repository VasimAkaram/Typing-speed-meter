// Random text generation (adding longer text)
const paragraphs = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Nulla facilisi. Donec ac felis vel lorem pharetra finibus vel a magna. Fusce sit amet nisi velit. Proin laoreet turpis lacus, nec bibendum enim tempor vitae.",
    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent et ornare mi, a tempor nisi. Sed sodales sollicitudin quam. Sed ac libero ante. Integer malesuada erat ut aliquet tempor.",
    // More large paragraphs can be added here
];

let startTime, typingInterval, isTypingStarted = false;
let errors = 0, totalWPM = 0, maxWPM = 0, wpmReadings = [];

const quoteBox = document.getElementById('quote');
const inputBox = document.getElementById('input-box');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const timeDisplay = document.getElementById('time-value');
const wpmDisplay = document.getElementById('wpm-value');
const avgWpmDisplay = document.getElementById('avg-wpm-value');
const maxWpmDisplay = document.getElementById('max-wpm-value');
const finalWpmDisplay = document.getElementById('final-wpm-value');
const charCountDisplay = document.getElementById('char-count');
const errorCountDisplay = document.getElementById('error-count');

// Function to pick a random paragraph
function getRandomParagraph() {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    return paragraphs[randomIndex];
}

function startTypingTest() {
    // Reset values
    inputBox.value = "";
    inputBox.disabled = false;
    inputBox.focus();
    errors = 0;
    errorCountDisplay.textContent = errors;
    charCountDisplay.textContent = 0;
    wpmDisplay.textContent = 0;
    avgWpmDisplay.textContent = 0;
    maxWpmDisplay.textContent = 0;
    finalWpmDisplay.textContent = 0;
    totalWPM = 0;
    wpmReadings = [];
    
    // Display a random paragraph
    const randomText = getRandomParagraph();
    quoteBox.textContent = randomText;

    // Initialize time tracking
    startTime = new Date().getTime();
    isTypingStarted = true;

    // Start interval to track time
    typingInterval = setInterval(updateTime, 1000);
}

function updateTime() {
    const currentTime = new Date().getTime();
    const timeElapsed = Math.floor((currentTime - startTime) / 1000);
    timeDisplay.textContent = timeElapsed;

    // Update WPM
    calculateWPM();
}

function calculateWPM() {
    const typedText = inputBox.value.trim();
    const wordsTyped = typedText.split(/\s+/).length;
    const timeElapsed = parseInt(timeDisplay.textContent);

    if (timeElapsed > 0) {
        const wpm = Math.floor((wordsTyped / timeElapsed) * 60);
        wpmDisplay.textContent = wpm;

        // Track max WPM
        maxWPM = Math.max(maxWPM, wpm);
        maxWpmDisplay.textContent = maxWPM;

        // Store WPM for average
        wpmReadings.push(wpm);
        const averageWPM = Math.floor(wpmReadings.reduce((a, b) => a + b) / wpmReadings.length);
        avgWpmDisplay.textContent = averageWPM;
    }
}

function checkErrors() {
    const randomText = quoteBox.textContent;
    const typedText = inputBox.value;

    // Track number of errors
    errors = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] !== randomText[i]) {
            errors++;
        }
    }
    errorCountDisplay.textContent = errors;
}

function finishTypingTest() {
    inputBox.disabled = true;
    clearInterval(typingInterval);
    calculateWPM();
    finalWpmDisplay.textContent = wpmDisplay.textContent;  // Final WPM
}

function resetTypingTest() {
    clearInterval(typingInterval);
    isTypingStarted = false;
    timeDisplay.textContent = "0";
    wpmDisplay.textContent = "0";
    avgWpmDisplay.textContent = "0";
    maxWpmDisplay.textContent = "0";
    finalWpmDisplay.textContent = "0";
    charCountDisplay.textContent = "0";
    errorCountDisplay.textContent = "0";
    inputBox.value = "";
    inputBox.disabled = true;
    quoteBox.textContent = "Click \"Start\" to begin typing the random text...";
}

// Event Listeners
startButton.addEventListener('click', () => {
    if (!isTypingStarted) {
        startTypingTest();
    }
});

inputBox.addEventListener('input', () => {
    const typedText = inputBox.value;

    // Update character count
    charCountDisplay.textContent = typedText.length;

    // Check for errors in the typed text
    checkErrors();

    // Complete typing when text matches
    if (typedText === quoteBox.textContent) {
        finishTypingTest();
    }
});

resetButton.addEventListener('click', resetTypingTest);
