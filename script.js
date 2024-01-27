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
let flippedCards = []; // Array to hold flipped card elements
let matchedCards = 0; // Number of matched pairs
let emojis = ['🤮','🤮', '🤡','🤡', '👽','👽', '💩','💩', '🎅🏿','🎅🏿','🥷🏿','🥷🏿', '🐲','🐲', '🌚','🌚']; // Emojis for the cards

// Function to start the game
function startGame() {
    // Reset game variables
    isGameStarted = true;
    moves = 0;
    seconds = 0;
    matchedCards = 0;
    cards = [];
    flippedCards = [];

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

    gameContainer.addEventListener('click', handleCardClick);
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

    // Generate card elements with emojis
    for (let i = 0; i < emojis.length; i++) {
        const card = createCardElement(emojis[i]);
        cards.push(card);
    }

    // Append cards to the game container
    cards.forEach(card => gameContainer.appendChild(card));
}

// Function to create a card element with given emoji
function createCardElement(emoji) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="cover"></div>
        <div class="emoji">${emoji}</div>
    `;
    card.addEventListener('click', handleCardClick);
    return card;
}

// Function to handle card clicks
function handleCardClick(event) {
    const card = event.currentTarget;

    // Check if the clicked card is already flipped, matched, or there are two flipped cards
    if (!card.classList.contains('flipped') && !card.classList.contains('matched') && flippedCards.length < 2) {
        // Flip the card
        card.classList.add('flipped');
        flippedCards.push(card);

   // Call the function to check for matches when two cards are flipped
   if (flippedCards.length === 2) {
    flipCards(); // Call the flipCards function
        }
    }
}

        // Check if two cards are flipped
        function flipCards() {
            // Increment move count
            moves++;
            movesCount.textContent = `Moves: ${moves}`;

            // Check if the flipped cards match
            const emoji1 = flippedCards[0].querySelector('.emoji').textContent;
            const emoji2 = flippedCards[1].querySelector('.emoji').textContent;
            if (emoji1 === emoji2) {
                // If they match, mark them as matched
                flippedCards.forEach(card => card.classList.add('matched'));
                matchedCards += 2;
            } else {
                // If they don't match, flip them back after a delay
                setTimeout(() => {
                    flippedCards.forEach(card => card.classList.remove('flipped'));
                }, 1000);
            }

            // Clear flippedCards array
            flippedCards = [];

            // Check if all cards are matched
            if (matchedCards === cards.length) {
                // Display the result
                resultDisplay.textContent = 'Congratulations! You won!';
                // Stop the game
                stopGame();
            }
        }

// Function to check flipped cards for matches
function checkFlippedCards() {
    // Check if two cards are flipped
    if (flippedCards.length === 2) {
        // Increment move count
        moves++;
        movesCount.textContent = `Moves: ${moves}`;

        // Check if the flipped cards match
        const emoji1 = flippedCards[0].querySelector('.emoji').textContent;
        const emoji2 = flippedCards[1].querySelector('.emoji').textContent;
        if (emoji1 === emoji2) {
            // If they match, mark them as matched
            flippedCards.forEach(card => card.classList.add('matched'));
            matchedCards += 2;
        } else {
            // If they don't match, flip them back after a delay
            setTimeout(() => {
                flippedCards.forEach(card => card.classList.remove('flipped'));
            }, 1000);
        }

        // Clear flippedCards array
        flippedCards = [];

        // Check if all cards are matched
        if (matchedCards === cards.length) {
            // Display the result
            resultDisplay.textContent = 'Congratulations! You won!';
            // Stop the game
            stopGame();
        }
    }
}



// Function to shuffle the cards
function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
        // Swap cards[i] with cards[j]
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    // Reattach shuffled cards to the game container
    gameContainer.innerHTML = ''; // Clear existing cards
    cards.forEach(card => gameContainer.appendChild(card));
}

// Event listeners
startGameButton.addEventListener('click', startGame);
stopGameButton.addEventListener('click', stopGame);
resetButton.addEventListener('click', resetGame);
