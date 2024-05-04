let score = 0;
let currentQuestion = 0;
let timerId;
let questions = [];
let level = 0; // Default level

function generateQuestions() {
    const operations = ['+', '-', '*', '/'];
    for (let i = 0; i < 10; i++) {
        let num1 = Math.floor(Math.random() * 12) + 1;
        let num2 = Math.floor(Math.random() * 12) + 1;
        const operation = operations[Math.floor(Math.random() * operations.length)];

        if (operation === '-') {
            if (num1 < num2) {
                [num1, num2] = [num2, num1];  // Ensure no negative results.
            }
        }

        if (operation === '/') {
            num1 = num1 * num2;  // Adjust to ensure a whole number result.
        }

        let correctAnswer = calculateAnswer(num1, num2, operation);
        let answers = generateFalseAnswers(correctAnswer);
        answers.push(correctAnswer);  // Add the correct answer back for display.
        answers.sort(() => Math.random() - 0.5);  // Shuffle answers.

        questions.push({ num1, num2, operation, correctAnswer, answers });
    }
}
function generateFalseAnswers(correctAnswer) {
    let answers = new Set([correctAnswer]);  // Start by adding the correct answer to the set to avoid duplication.
    while (answers.size < 3) {  // We need three answers total: one correct and two incorrect.
        let variation = Math.floor(Math.random() * 10) - 5;  // Generate variations that range more widely to avoid collision with correct answer.
        let newAnswer = correctAnswer + variation;
        // Ensure new answer is not the correct answer, it's positive, and not already included.
        if (newAnswer !== correctAnswer && newAnswer > 0 && !answers.has(newAnswer)) {
            answers.add(newAnswer);
        }
    }
    answers.delete(correctAnswer);  // Remove the correct answer to only return incorrect answers.
    return Array.from(answers);
}


function calculateAnswer(num1, num2, operation) {
    switch (operation) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case '*': return num1 * num2;
        case '/': return num1 / num2;
    }
}

function initGame() {
    const urlParams = new URLSearchParams(window.location.search);
    level = parseInt(urlParams.get('level'));
    generateQuestions();
    displayQuestion();
}

function displayQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('questionDisplay').innerHTML = `Question ${currentQuestion + 1}: What is ${question.num1} ${question.operation} ${question.num2}?`;
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';
    question.answers.forEach(answer => {
        let button = document.createElement('button');
        button.textContent = answer;
        button.onclick = function() { checkAnswer(answer); };
        button.classList.add('answer-button');
        answersContainer.appendChild(button);
    });

    if (level !== 0) {
        startTimer(level === 1 ? 20 : 10);
    }
}

function startTimer(seconds) {
    const timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.innerHTML = `Time remaining: ${seconds} seconds`;
    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
        seconds--;
        timerDisplay.innerHTML = `Time remaining: ${seconds} seconds`;
        if (seconds <= 0) {
            clearInterval(timerId);
            alert("Time's up!");
            moveToNextQuestion();
        }
    }, 1000);
}

function moveToNextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        endGame();
    }
}

function checkAnswer(selectedAnswer) {
    if (timerId) clearTimeout(timerId);
    const question = questions[currentQuestion];
    if (selectedAnswer === question.correctAnswer) {
        score++;
        alert("Correct!");
    } else {
        alert(`Wrong! The correct answer was ${question.correctAnswer}.`);
    }
    moveToNextQuestion();
}

function endGame() {
    sessionStorage.setItem('score', score);}