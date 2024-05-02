
//Testing Function
function displayDate() {
    document.getElementById('date').innerHTML = new Date().toDateString();
}


//Arithmetics

// Define game parameters
const numQuestions = 10;
let score = 0;
let currentQuestion = 0;
let timerId;
let levelTimeLimits = [Infinity, 20000, 10000]; // Time limits in milliseconds

function generateQuestion() {
    const operations = ['+', '-', '*', '/'];
    let num1 = Math.floor(Math.random() * 12) + 1;
    let num2 = Math.floor(Math.random() * 12) + 1;
    const operation = operations[Math.floor(Math.random() * operations.length)];

    // Ensure non-negative results for subtraction
    if (operation === '-') {
        if (num1 < num2) {
            [num1, num2] = [num2, num1]; // Swap to avoid negative results
        }
    }

    // Ensure non-negative, whole number results for division
    if (operation === '/') {
        num1 = num1 * num2; // Adjust to ensure whole number results
    }

    return { num1, num2, operation };
}

function calculateAnswer(question) {
    switch (question.operation) {
        case '+':
            return question.num1 + question.num2;
        case '-':
            return question.num1 - question.num2;
        case '*':
            return question.num1 * question.num2;
        case '/':
            return question.num1 / question.num2;
    }
}

function askQuestion() {
    if (currentQuestion >= numQuestions) {
        endGame();
        return;
    }

    const question = generateQuestion();
    const userAnswer = prompt(`Question ${currentQuestion + 1}: What is ${question.num1} ${question.operation} ${question.num2}?`);
    if (parseInt(userAnswer) === calculateAnswer(question)) {
        score++;
        alert("Correct!");
    } else {
        alert(`Wrong! The correct answer was ${calculateAnswer(question)}.`);
    }

    currentQuestion++;
    if (currentQuestion < numQuestions) {
        setupQuestion(level);
    }
}

function setupQuestion(level) {
    if (timerId) clearTimeout(timerId);
    askQuestion();
    if (level > 0) {
        timerId = setTimeout(() => {
            alert("Time's up!");
            currentQuestion++;
            if (currentQuestion < numQuestions) {
                setupQuestion(level);
            } else {
                endGame();
            }
        }, levelTimeLimits[level]);
    }
}

function startGame(level) {
    score = 0;
    currentQuestion = 0;
    setupQuestion(level);
}

function endGame() {
    alert(`Game Over! Your score was ${score} out of ${numQuestions}.`);
    if (timerId) clearTimeout(timerId);
}

// Example of starting a game at level 0 (no time limit)
// Change to startGame(1) for 20 seconds, startGame(2) for 10 seconds limit
startGame(0);