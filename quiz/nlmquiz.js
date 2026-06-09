const questions = [
    { question: "What does Newton's First Law state?", options: ["F = ma", "Action = Reaction", "Objects stay in motion/rest unless acted on", "Momentum is conserved"], answer: "Objects stay in motion/rest unless acted on" },
    { question: "Which force is required to change the state of motion of an object?", options: ["Friction", "Gravity", "Applied Force", "Centripetal Force"], answer: "Applied Force" },
    { question: "Newton's Second Law states that force is equal to:", options: ["mass × acceleration", "mass × velocity", "momentum × time", "velocity × time"], answer: "mass × acceleration" },
    { question: "What happens when two equal and opposite forces act on an object?", options: ["The object moves in the direction of the larger force", "The object accelerates", "The object remains in equilibrium", "The object gains momentum"], answer: "The object remains in equilibrium" },
    { question: "According to Newton’s Third Law, what happens when you push on a wall?", options: ["The wall moves", "The wall exerts an equal force back on you", "No force is applied back", "Only you experience the force"], answer: "The wall exerts an equal force back on you" },
    { question: "What is inertia?", options: ["The tendency of an object to resist a change in motion", "The force applied by a moving object", "The acceleration of an object due to gravity", "The energy stored in a moving object"], answer: "The tendency of an object to resist a change in motion" },
    { question: "If an object's mass increases, what happens to the force required to accelerate it?", options: ["Increases", "Decreases", "Remains the same", "Depends on velocity"], answer: "Increases" },
    { question: "Which of the following is an example of Newton’s Third Law?", options: ["A car accelerating when force is applied", "A book resting on a table", "A rocket launching by expelling gases", "An object staying at rest"], answer: "A rocket launching by expelling gases" }
];


let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let userAnswers = new Array(questions.length).fill(null);

function loadQuestion() {
    let questionData = questions[currentQuestionIndex];
    document.getElementById("question").textContent = questionData.question;

    let optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    questionData.options.forEach(option => {
        let btn = document.createElement("button");
        btn.classList.add("option");
        btn.textContent = option;
        btn.onclick = () => selectOption(btn, option);
        optionsContainer.appendChild(btn);
    });

    selectedOption = null;
    document.getElementById("next-btn").disabled = true;
    document.getElementById("prev-btn").disabled = currentQuestionIndex === 0;
    document.getElementById("submit-btn").classList.toggle("hidden", currentQuestionIndex !== questions.length - 1);
    document.getElementById("next-btn").classList.toggle("hidden", currentQuestionIndex === questions.length - 1);

    updateProgressBar();
}

function selectOption(button, option) {
    document.querySelectorAll(".option").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
    selectedOption = option;
    userAnswers[currentQuestionIndex] = option;
    document.getElementById("next-btn").disabled = false;
}

function nextQuestion() {
    if (!selectedOption) {
        showPopup();
        return;
    }

    if (selectedOption === questions[currentQuestionIndex].answer) {
        score++;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function prevQuestion() {
    currentQuestionIndex--;
    loadQuestion();
}

function confirmSubmit() {
    document.getElementById("confirm-popup").style.display = "block";
}

function submitQuiz() {
    if (!selectedOption) {
        showPopup();
        return;
    }

    if (selectedOption === questions[currentQuestionIndex].answer) {
        score++;
    }

    document.getElementById("confirm-popup").style.display = "none";
    showResults();
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;
    userAnswers.fill(null);

    document.getElementById("quiz-box").classList.remove("hidden");
    document.getElementById("result-box").classList.add("hidden");

    document.getElementById("progress-bar").style.width = "0%";

    loadQuestion();
}

function showPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function closeConfirmPopup() {
    document.getElementById("confirm-popup").style.display = "none";
}

function showResults() {
    const finishAt = Date.now();
    const totalQuestions = questions.length;
    const totalScore = score;
    const correctCount = score;
    const startAt = window.__quizNlmStartedAt || finishAt;
    const timeTakenMs = Math.max(0, finishAt - startAt);

    try {
        if (window.quizProgress && typeof window.quizProgress.recordAttempt === 'function') {
            window.quizProgress.recordAttempt({
                topicId: "physics-nlm",
                score: totalScore,
                totalQuestions,
                correctCount,
                timeTakenMs,
                quizId: "quiz:nlm",
            });
        }
    } catch (e) {
        console.warn("LearnSphere: Failed to record quiz progress", e);
    }

    document.getElementById("quiz-box").classList.add("hidden");
    document.getElementById("result-box").classList.remove("hidden");

    let scoreText = `You scored <strong>${score}</strong> out of ${questions.length}! 🎉`;
    let feedbackHTML = "";

    questions.forEach((q, index) => {
        let userAnswer = userAnswers[index] || "No answer selected";
        let isCorrect = userAnswer === q.answer;

        feedbackHTML += `
            <div class="${isCorrect ? "correct" : "incorrect"}">
                <p><strong>Q${index + 1}:</strong> ${q.question}</p>
                <p>Your answer: <strong class="${isCorrect ? "correct-answer" : "wrong-answer"}">${userAnswer}</strong></p>
                ${isCorrect ? `<p>✅ Correct!</p>` : `<p>❌ Incorrect! </p> <p class="correct-answer"> The correct answer is: <strong class="correct-answer">${q.answer}</strong></p>`}
                <hr>
            </div>
        `;
    });

    document.getElementById("score").innerHTML = scoreText + "<br><br>" + feedbackHTML;
}

function updateProgressBar() {
    let progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById("progress-bar").style.width = progress + "%";
}

document.addEventListener("DOMContentLoaded", () => {
    window.__quizNlmStartedAt = Date.now();
    document.getElementById("progress-bar").style.width = "0%";
    loadQuestion();
});
