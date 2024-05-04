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
                [num1, num2] = [num2, num1]; // Swap to avoid negative results
            }
        }

        if (operation === '/') {
            num1 = num1 * num2; // Ensure a whole number result
        }

        let correctAnswer = calculateAnswer(num1, num2, operation);
        let answers = generateFalseAnswers(correctAnswer);
        answers.push(correctAnswer);
        answers.sort(() => Math.random() - 0.5); // Shuffle answers

        questions.push({ num1, num2, operation, correctAnswer, answers });
    }
}

function calculateAnswer(num1, num2, operation) {
    switch (operation) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case '*': return num1 * num2;
        case '/': return num1 / num2;
    }
}

function generateFalseAnswers(correctAnswer) {
    let answers = new Set();
    answers.add(correctAnswer);
    while (answers.size < 3) {
        let variation = Math.floor(Math.random() * 5) - 2; // Range from -2 to 2
        let newAnswer = correctAnswer + variation;
        if (newAnswer !== correctAnswer && newAnswer >= 0) {
            answers.add(newAnswer);
        }
    }
    return Array.from(answers);
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

function checkAnswer(selectedAnswer) {
    const question = questions[currentQuestion];
    if (selectedAnswer === question.correctAnswer) {
        score++;
        alert("Correct!");
    } else {
        alert(`Wrong! The correct answer was ${question.correctAnswer}.`);
    }
    currentQuestion++;
    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    sessionStorage.setItem('score', score);
    window.location.href = 'end.html';
}

function initGame() {
    const urlParams = new URLSearchParams(window.location.search);
    level = parseInt(urlParams.get('level'));
    generateQuestions();
    displayQuestion();
}

