// Global variables to keep track of game state
let score = 0;
let currentQuestion = 0;
let timerId;
let questions = [];
let level = 0; // Default game level

// Function to generate all questions for one game session
function generateQuestions() {
    const operations = ['+', '-', '*', '/']; // List of arithmetic operations
    for (let i = 0; i < 10; i++) {
        let num1 = Math.floor(Math.random() * 12) + 1; // Random number between 1 and 12
        let num2 = Math.floor(Math.random() * 12) + 1; // Random number between 1 and 12
        const operation = operations[Math.floor(Math.random() * operations.length)]; // Randomly pick an operation

        // Adjust numbers to avoid negative results for subtraction
        if (operation === '-') {
            if (num1 < num2) {
                [num1, num2] = [num2, num1]; // Swap to ensure num1 is not less than num2
            }
        }

        // Adjust numbers to ensure division results in a whole number
        if (operation === '/') {
            num1 = num1 * num2; // Adjust num1 to be a multiple of num2
        }

        let correctAnswer = calculateAnswer(num1, num2, operation); // Calculate the correct answer
        let answers = generateFalseAnswers(correctAnswer); // Generate two incorrect answers
        answers.push(correctAnswer); // Add correct answer to the list
        answers.sort(() => Math.random() - 0.5); // Shuffle the answers

        // Store the question and its answers
        questions.push({ num1, num2, operation, correctAnswer, answers });
    }
}

// Function to calculate the correct answer based on the operation
function calculateAnswer(num1, num2, operation) {
    switch (operation) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case '*': return num1 * num2;
        case '/': return num1 / num2;
    }
}

// Function to generate two distinct incorrect answers
function generateFalseAnswers(correctAnswer) {
    let answers = new Set([correctAnswer]); // Initialize set with correct answer to avoid duplication
    while (answers.size < 3) {
        let variation = Math.floor(Math.random() * 10) - 5; // Generate variation between -5 and 4
        let newAnswer = correctAnswer + variation;
        if (newAnswer !== correctAnswer && newAnswer > 0 && !answers.has(newAnswer)) {
            answers.add(newAnswer); // Add only valid and distinct answers
        }
    }
    answers.delete(correctAnswer); // Remove the correct answer to return only incorrect ones
    return Array.from(answers);
}

// Function to display the current question and its answers
function displayQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('questionDisplay').innerHTML = `Question ${currentQuestion + 1}: What is ${question.num1} ${question.operation} ${question.num2}?`;
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = ''; // Clear previous answers
    question.answers.forEach(answer => {
        let button = document.createElement('button');
        button.textContent = answer;
        button.onclick = function() { checkAnswer(answer); };
        button.classList.add('answer-button');
        answersContainer.appendChild(button); // Add a button for each answer
    });

    // Setup timer for levels 1 and 2
    if (level !== 0) {
        startTimer(level === 1 ? 20 : 10); // Start timer with 20 or 10 seconds depending on level
    }
}

// Function to handle the timer countdown
function startTimer(seconds) {
    const timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.innerHTML = `Time remaining: ${seconds} seconds`;
    if (timerId) clearInterval(timerId); // Clear any existing timer
    timerId = setInterval(() => {
        seconds--;
        timerDisplay.innerHTML = `Time remaining: ${seconds} seconds`;
        if (seconds <= 0) {
            clearInterval(timerId);
            showModal("Time's up!");
            moveToNextQuestion(); // Move to the next question when time runs out
        }
    }, 1000);
}

// Function to advance to the next question or end the game
function moveToNextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        displayQuestion(); // Display next question if any
    } else {
        endGame(); // End the game if no more questions
    }
}

// Function to check the user's selected answer
function checkAnswer(selectedAnswer) {
    if (timerId) clearTimeout(timerId); // Stop the timer
    const question = questions[currentQuestion];
    if (selectedAnswer === question.correctAnswer) {
        score++;
        showModal("Correct!");
    } else {
        showModal(`Wrong! The correct answer was ${question.correctAnswer}.`);
    }
    moveToNextQuestion(); // Proceed to the next question
}

// Function to end the game and handle the transition to the ending screen
function endGame() {
    sessionStorage.setItem('score', score); // Store score in sessionStorage
    window.location.href = 'end.html'; // Redirect to the ending screen
}

// Function to initialize the game based on selected level
function initGame() {
    const urlParams = new URLSearchParams(window.location.search);
    level = parseInt(urlParams.get('level')); // Get the selected level from URL
    generateQuestions(); // Generate all questions
    displayQuestion(); // Display the first question
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = "none";
    proceedAfterModal();
}

function showModal(message) {
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modalText');
    const closeButton = document.getElementsByClassName('close')[0];

    modalText.textContent = message;
    modal.style.display = "block";

    // Close modal when the close button is clicked
    closeButton.onclick = function() {
        closeModal();
    }
}

function proceedAfterModal() {
    // Function to handle what happens after the modal closes
    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        endGame();
    }
}
//Falling numbers for background
function createFallingNumber() {
    const numberContainer = document.getElementById('animatedBackground');
    const number = document.createElement('div');
    number.className = 'falling-number';
    number.textContent = Math.floor(Math.random() * 10); // Random number between 0 and 9
    number.style.left = `${Math.random() * 100}%`; // Random horizontal position
    number.style.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`; // Random color
    number.style.fontSize = `${Math.random() * 24 + 12}px`; // Random font size between 12px and 36px

    number.onanimationend = () => number.remove(); // Remove number after animation ends

    numberContainer.appendChild(number);
}

// Reduce interval time to make numbers appear faster
setInterval(createFallingNumber, 50); // Numbers appear every n milliseconds
