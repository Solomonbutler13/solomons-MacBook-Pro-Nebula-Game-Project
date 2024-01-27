const startGameButton = document.getElementById('start-game');
const stopGameButton = document.getElementById('stop');
const resetButton = document.getElementById('reset-game');
const movesCount = document.getElementById('moves-count');
const timerDisplay = document.getElementById('timer');
const gameContainer = document.getElementById('game-container');
const resultDisplay = document.getElementById('result');

let isGameStarted = false;
let moves = 0;
let seconds = 0;
let timerInterval;
let cards = []; // Array to hold card elements
let matchedCards = 0; // Number of matched pairs
let emojis = ['🤮', '🤮', '🤡', '🤡', '👽', '👽', '💩', '💩', '🎅🏿', '🎅🏿', '🥷🏿', '🥷🏿', '🐲', '🐲', '🌚', '🌚']; // Emojis for the cards
const emojiDataSet = {
    '🤮': 1,
    '🤡': 2,
    '👽': 3,
    '💩': 4,
    '🎅🏿': 5,
    '🥷🏿': 6,
    '🐲': 7,
    '🌚': 8
};

// Function to start the game
function startGame() {
    // Reset game variables
    isGameStarted = true;
    moves = 0;
    seconds = 0;
    matchedCards = 0;
    cards = [];

    // Reset displays
    movesCount.textContent = 'Moves: 0';
    timerDisplay.textContent = 'Time: 0s';
    resultDisplay.textContent = '';

    // Start the timer
    timerInterval = setInterval(updateTimer, 1000);

    // Generate and display cards
    createCards();

    // Shuffle the cards
    shuffleCards();

    // Show the "End Game" button
    stopGameButton.classList.remove('hide');

   // gameContainer.addEventListener('click', handleCardClick);
}

// Function to stop the game
function stopGame() {
    isGameStarted = false;

    // Stop the timer
    clearInterval(timerInterval);

    // Hide the "End Game" button
    stopGameButton.classList.add('hide');
}

// Function to reset the game
function resetGame() {
    stopGame();
    startGame();
}

// Function to update the timer display
function updateTimer() {
    seconds++;
    timerDisplay.textContent = `Time: ${seconds}s`;
}

// Function to create and display cards with emojis
function createCards() {
    gameContainer.innerHTML = '';
    let cardIndex = 0;

    for (let i = 0; i < emojis.length; i++) {
        const card = createCardElement(emojis[i], cardIndex++);
        cards.push(card);
    }
    cards.forEach(card => gameContainer.appendChild(card));
}

// Function to compare the flipped cards
function compareCards() {
    // Select flipped cards dynamically
    const flippedCards = document.querySelectorAll('.card.flipped');

    const value1 = flippedCards[0].querySelector('.emoji').textContent;
    const value2 = flippedCards[1].querySelector('.emoji').textContent;

    // Checking if the two cards match
    if (value1 === value2) {
        // If they match, apply the 'matched' class and remove click event
        flippedCards.forEach(card => {
            card.classList.add('matched');
            card.classList.remove("flipped")
          card.removeEventListener('click', handleCardClick);
        });
        matchedCards += 1;


        // Check if the game is completed
        if (matchedCards === emojis.length / 2) {
            resultDisplay.textContent = `Congratulations! You've matched all pairs in ${seconds} seconds with ${moves} moves.`;
            stopGame();
        }
    } else {
        // If not a match, flip them back after a delay
        setTimeout(() => {
            flippedCards.forEach(card => card.classList.remove('flipped'));
        }, 1500);
    }

    // Reset flippedCards array and update moves
    moves++;
    movesCount.textContent = `Moves: ${moves}`;
}

// Function to handle card clicks
function handleCardClick(event) {
    console.log ("handleCardClick")
    const card = event.currentTarget;

    // Check if the clicked card is already flipped, matched, or there are two flipped cards
    if (!card.classList.contains('flipped') && !card.classList.contains('matched') && document.querySelectorAll('.card.flipped').length < 2) {
        // Flip the card
        card.classList.add('flipped');

        // Check if two cards are flipped
        if (document.querySelectorAll('.card.flipped').length === 2) {
            compareCards(); // Call the compareCards function
        }
    }
}

function createCardElement(emoji, cardIndex) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-index', cardIndex);
    card.innerHTML = `
        <div class="cover"></div>
        <div class="emoji">${emoji}</div>
    `;
    card.addEventListener('click', handleCardClick);
    return card;
}

// Function to shuffle the cards
function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    gameContainer.innerHTML = '';
    cards.forEach(card => gameContainer.appendChild(card));
}

// Event listeners
startGameButton.addEventListener('click', startGame);
stopGameButton.addEventListener('click', stopGame);
resetButton.addEventListener('click', resetGame);
