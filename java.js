const N = 4; // დაფის ზომა
const boardElement = document.getElementById('board');
boardElement.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
const startButton = document.getElementById('start-button');
const timeElement = document.getElementById('time');

let timerInterval;
let startTime;
let cards;
let firstCard = null;
let secondCard = null;
let lockBoard = false;

// შესაძლო ფიგურები
const shapes = ['🔵', '🔴', '🔶', '🔷', '🔺', '🔻', '⭐', '🌟'];

// თამაშის დაწყების ღილაკზე დაჭერა
startButton.addEventListener('click', startGame);

function startGame() {
    boardElement.innerHTML = ''; // დაფის გასუფთავება
    cards = shapes.concat(shapes).slice(0, N * N); /*აკავშირებს და არევს ფიგურებს.*/
    cards = cards.sort(() => Math.random() - 0.5);

    cards.forEach(shape => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.textContent = shape;
        cardElement.dataset.shape = shape;
        boardElement.appendChild(cardElement);
    });

    // ფიგურების დამალვა რამდენიმე წამის შემდეგ
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('hidden');
            card.textContent = '';
        });
        startTimer();
    }, 3000); /*ფიგურების დამალვა 3 წამის შემდეგ.*/
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timeElement.textContent = elapsedTime;
    }, 1000); /*განაახლებს ტაიმერს ყოველ წამს.*/
}

function stopTimer() {
    clearInterval(timerInterval); /*აჩერებს ტაიმერის განახლებას.*/
}

boardElement.addEventListener('click', event => { /*აწყობს ფიგურების შეხების რეაქციას.*/
    const clickedCard = event.target;
    if (!clickedCard.classList.contains('card') || lockBoard || !clickedCard.classList.contains('hidden')) return; /*ამოწმებს პირობებს*/
    if (clickedCard === firstCard) return; /*ამოწმებს, რომ ერთი და იგივე ფიგურა არ იყოს.*/

    clickedCard.classList.remove('hidden'); /*აბრუნებს ფიგურას*/
    clickedCard.textContent = clickedCard.dataset.shape;

    if (!firstCard) {
        firstCard = clickedCard;
        return;
    }

    secondCard = clickedCard;
    lockBoard = true;

    if (firstCard.dataset.shape === secondCard.dataset.shape) {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        checkWin(); /*ამოწმებს მოგებას*/
    } else {
        setTimeout(() => {
            firstCard.classList.add('hidden');
            firstCard.textContent = '';
            secondCard.classList.add('hidden');
            secondCard.textContent = '';
            firstCard = null;
            secondCard = null;
            lockBoard = false;
        }, 1000); /*ამოწმებს და ადარებს ფიგურებს*/
    }
});

function checkWin() { /*ამოწმებს თუ ყველა ფიგურა აღმოჩენილია.*/
    const hiddenCards = document.querySelectorAll('.card.hidden'); /*ამოწმებს დამალულ ფიგურებს.*/
    if (hiddenCards.length === 0) {
        stopTimer();
        alert(`გილოცავთ! თამაში დასრულდა ${timeElement.textContent} წამში.`);
    }
}
