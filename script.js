
//references to various elements in the HTML

const startGameButton = document.getElementById('start-game');
const stopGameButton = document.getElementById('stop');
const resetButton = document.getElementById('reset-game');
const movesCount = document.getElementById('moves-count');
const timerDisplay = document.getElementById('timer');
const gameContainer = document.getElementById('game-container');
const resultDisplay = document.getElementById('result');

//variables to track game state and statistics

let isGameStarted = false;
let moves = 0;
let seconds = 0;
let timerInterval;
let cards = []; // Array to hold card elements
let matchedCards = 0; // Number of matched pairs

//Array of emojis for cards
let emojis = ['🤮', '🤮', '🤡', '🤡', '👽', '👽', '💩', '💩', '🎅🏿', '🎅🏿', '🥷🏿', '🥷🏿', '🐲', '🐲', '🌚', '🌚']; 

// Object mapping emojis to their corresponding data values
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

    // Generate and display cards (loop through the array, create elements for each card, and append to the gameContainer.)
    createCards();

    // Shuffle the cards (rearranges order of card elements in Container)
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
    // Clear the existing content
    gameContainer.innerHTML = '';
    let cardIndex = 0;    //keep track of the index of each card

    for (let i = 0; i < emojis.length; i++) {    // Iterate through each emoji in the emojis array to create cards
        const card = createCardElement(emojis[i], cardIndex++); // Create card element for current emoji and increment card index

        cards.push(card);  // Add card to the cards array
    }
    cards.forEach(card => gameContainer.appendChild(card)); // Append card element to the game container for display
}

// Function to compare the flipped cards
function compareCards() {
    // Select flipped cards dynamically
    const flippedCards = document.querySelectorAll('.card.flipped');

    // Get the values (emojis) of the flipped cards
    const value1 = flippedCards[0].querySelector('.emoji').textContent;
    const value2 = flippedCards[1].querySelector('.emoji').textContent;

    // Checking if the two cards match
    if (value1 === value2) {
        // If they match, apply the 'matched' class and remove click event
        flippedCards.forEach(card => {
            card.classList.add('matched');   // apply match
            card.classList.remove('flipped');  //remove flipped class
            card.removeEventListener('click', handleCardClick);  // to prevent interaction with other matched cards
        });
        matchedCards += 1; // increment matched pairs

        // Check if the game is completed
        if (matchedCards === emojis.length / 2) { //if all cards divided by 2 and matched 
            resultDisplay.textContent = `Congratulations! You've matched all pairs in ${seconds} seconds with ${moves} moves.`;
            stopGame(); //ends game
        }
    } else {
        // If not a match, flip them back after a delay
        setTimeout(() => {
            flippedCards.forEach(card => card.classList.remove('flipped'));
        }, 1500); //delay before flipping back
    }

    // Increment the moves count and update the moves display
    moves++;
    movesCount.textContent = `Moves: ${moves}`;
}


// Function to handle card clicks
function handleCardClick(event) {
    console.log ("handleCardClick") // Log a message to the console indicating that a card click event has been handled
    const card = event.currentTarget;  // Get the clicked card element

    // Check if the clicked card is already flipped, matched, or there are two flipped cards
    if (!card.classList.contains('flipped') && !card.classList.contains('matched') && document.querySelectorAll('.card.flipped').length < 2) {
        // If the clicked card is not flipped, not matched, and there are less than two flipped cards already
        
        // Flip the card
        card.classList.add('flipped');

        // Check if two cards are flipped
        if (document.querySelectorAll('.card.flipped').length === 2) {
            compareCards(); // Call the compareCards function
        }
    }
}

// Function to create a card element with the given emoji and card index
function createCardElement(emoji, cardIndex) {
    
    const card = document.createElement('div'); // Create a new <div> element for the card
    card.classList.add('card');  // Add the 'card' class to the card element
    card.setAttribute('data-index', cardIndex); // Set the 'data-index' attribute of the card
    // Set the inner HTML of the card element
    card.innerHTML = `  
        <div class="cover"></div>
        <div class="emoji">${emoji}</div>
    `;
    card.addEventListener('click', handleCardClick); //// Add a click event listener to the card element, calling the handleCardClick function when clicked
    return card;
}

// Function to shuffle the cards
function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) { // Loop through cards array in reverse order
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index 'j' between 0 and 'i' (Fisher-Yates shuffle algorithm, commonly used to shuffle elements in an array.)
        [cards[i], cards[j]] = [cards[j], cards[i]];  //Swap positions of the cards at indices 'i' and 'j' in the cards array
    }
    gameContainer.innerHTML = ''; // clear game container
    cards.forEach(card => gameContainer.appendChild(card)); // Append each card element to the game container in its new shuffled order
}

// Event listeners
startGameButton.addEventListener('click', startGame);
stopGameButton.addEventListener('click', stopGame);
resetButton.addEventListener('click', resetGame);
