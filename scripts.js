
// sounds
const flipSound = new Audio('sounds/flip.mp3');
const matchSound = new Audio('sounds/match.mp3');
const mismatchSound = new Audio('sounds/mismatch.mp3');
const winSound = new Audio('sounds/win.mp3');

// for move count
let moves = 0;
const moveCounter = document.getElementById("moveCounter");

const timerDisplay = document.getElementById("timer");

const emojiList = ['🐱', '🐶', '🦊', '🐼', '🐸', '🐵', '🦁', '🐰'];
let cardsArray = [...emojiList, ...emojiList]; // 8 pairs
let flippedCards = [];
let lockBoard = false;

const gameBoard = document.getElementById('gameBoard');

let startBtn = document.getElementById("startBtn");
let restartBtn = document.getElementById("restartBtn");
let timerInterval;
let time = 0;
let isGameStarted = false;

startBtn.addEventListener("click", () => {
    isGameStarted = true;
    startBtn.style.display = "none";
    restartBtn.style.display = "inline-block";
    startGame();
    startTimer();
});

function startGame() {
    time = 0;
    updateTimeDisplay();
    setupCards();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        time++;
        updateTimeDisplay();
    }, 1000);
}

function updateTimeDisplay() {
    document.getElementById("timeDisplay").innerText = `${time}s`;
}

function endGame() {
    clearInterval(timerInterval);
    isGameStarted = false;
}

// Create and shuffle cards
function setupCards() {
  gameBoard.innerHTML = '';

  moves = 0;
  moveCounter.textContent = `Moves: 0`;

  flippedCards = [];
  lockBoard = false;

  shuffleArray(cardsArray).forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-name', emoji);

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">❓</div>
        <div class="card-back">${emoji}</div>
      </div>
    `;

    card.addEventListener('click', () => handleCardClick(card));
    gameBoard.appendChild(card);
  });
}

function handleCardClick(card) {
  if (!isGameStarted || lockBoard || card.classList.contains('matched') || card.classList.contains('flipped')) {
    return;
  }

  card.classList.add('flipped');
  flipSound.currentTime = 0;
  flipSound.play();
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    moveCounter.textContent = `Moves: ${moves}`;
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const name1 = card1.getAttribute('data-name');
  const name2 = card2.getAttribute('data-name');

  if (name1 === name2) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchSound.currentTime = 0;
    matchSound.play();
    flippedCards = [];
    checkWin();
  } else {
    lockBoard = true;
    mismatchSound.currentTime = 0;
    mismatchSound.play();
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      lockBoard = false;
    }, 1000);
  }
}

function checkWin() {
  const matchedCards = document.querySelectorAll('.card.matched');
  if (matchedCards.length === cardsArray.length) {

    clearInterval(timerInterval); //stops the timer here
    winSound.currentTime = 0;
    winSound.play();
    setTimeout(() => {
      alert('You matched all the animals!');
    }, 500);
  }
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Restart button
restartBtn.addEventListener('click', startGame);

// Initial setup
setupCards();
