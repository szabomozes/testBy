const quizContainer = document.getElementById("container");
const nextBtn = document.getElementById("next-button");
const countOfQuestion = document.querySelector(".number-of-question");
const displayContainer = document.getElementById("display-container");
const scoreContainer = document.querySelector(".score-container");
const restart = document.getElementById("restart");
const userScore = document.getElementById("user-score");
const startScreen = document.querySelector(".start-screen");
const startButton = document.getElementById("start-button");

let questionCount;
let scoreCount = 0;
let isSubmitted = false;
let shouldShuffleQuestions = true;
let correctAnswersCount = 0;
let incorrectAnswersCount = 0;

let quizArray = [];

// Load quiz data from JSON file or fallback to default
async function loadQuizData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Network response was not ok');
    quizArray = await response.json();
  } catch (error) {
    console.error('Error loading quiz data:', error);
    quizArray = [
      {
        id: "0",
        question: "Default question 1?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct: ["Option 1"]
      }
    ];
  }
  initial();
}

// Restart quiz
restart.addEventListener("click", () => {
  initial();
  displayContainer.classList.remove("hide");
  scoreContainer.classList.add("hide");
});

// Next button click: either submit answers or display next question
nextBtn.addEventListener("click", () => {
  if (isSubmitted) {
    displayNext();
    isSubmitted = false;
    nextBtn.textContent = "Check";
    nextBtn.disabled = true;
  } else {
    submitAnswers();
  }
});

function displayNext() {
  questionCount++;
  if (questionCount >= quizArray.length) {
    displayContainer.classList.add("hide");
    scoreContainer.classList.remove("hide");
    const total = quizArray.length;
    const percentage = Math.round((scoreCount / total) * 100);
    userScore.innerHTML = `Result: ${scoreCount}/${total} (${percentage}%)<br>${correctAnswersCount} correct | ${incorrectAnswersCount} incorrect`;
  } else {
    countOfQuestion.textContent = `${questionCount + 1}/${quizArray.length} question`;
    quizDisplay(questionCount);
    nextBtn.disabled = true;
  }
}

function quizDisplay(index) {
  const quizCards = document.querySelectorAll(".container-mid");
  quizCards.forEach(card => card.classList.add("hide"));
  if (quizCards[index]) quizCards[index].classList.remove("hide");
}

// Handles option selection
function checker(userOption) {
  const question = quizArray[questionCount];
  if (question.correct.length === 1) {
    // Single correct answer, deselect others
    const selectedOptions = document.querySelectorAll('.container-mid:not(.hide) .option-div.selected');
    selectedOptions.forEach(option => {
      if (option !== userOption) option.classList.remove("selected");
    });
    userOption.classList.toggle("selected");
  } else {
    // Multiple correct answers allowed
    userOption.classList.toggle("selected");
  }
  updateSubmitButton();
}

// Enables or disables the next button based on selection
function updateSubmitButton() {
  const currentQuestion = quizArray[questionCount];
  const currentSelected = document.querySelectorAll('.container-mid:not(.hide) .option-div.selected').length;

  if (
    (currentQuestion.correct.length === 1 && currentSelected === 1) ||
    (currentQuestion.correct.length > 1 && currentSelected >= 1)
  ) {
    nextBtn.disabled = false;
  } else {
    nextBtn.disabled = true;
  }
}

// Submits answers and highlights correct/incorrect options
function submitAnswers() {
  const questionElement = document.getElementsByClassName("container-mid")[questionCount];
  const options = questionElement.querySelectorAll(".option-div");

  const selectedOptions = Array.from(options)
    .filter(option => option.classList.contains("selected"))
    .map(option => option.textContent.trim());

  const correctAnswers = quizArray[questionCount].correct;

  // Mark correct answers
  options.forEach(option => {
    const text = option.textContent.trim();
    if (correctAnswers.includes(text)) {
      if (selectedOptions.includes(text)) {
        option.classList.add("correct");
      } else {
        option.classList.add("correct-missed");
      }
    }
  });

  // Mark incorrect answers
  options.forEach(option => {
    const text = option.textContent.trim();
    if (selectedOptions.includes(text) && !correctAnswers.includes(text)) {
      option.classList.add("incorrect");
    }
    // Disable option buttons after submission
    option.disabled = true;
  });

  // Check if all correct answers are selected and no incorrect options chosen
  const allCorrectSelected = correctAnswers.every(answer => selectedOptions.includes(answer));
  const noIncorrectSelected = selectedOptions.every(option => correctAnswers.includes(option));

  if (allCorrectSelected && noIncorrectSelected) {
    scoreCount++;
    correctAnswersCount++;
  } else {
    incorrectAnswersCount++;
  }

  updateScoreDisplay();

  isSubmitted = true;
  nextBtn.disabled = false;
  nextBtn.textContent = "Next";
}

function updateScoreDisplay() {
  const scoreInfoElement = document.querySelector('.score-info');
  if (scoreInfoElement) {
    scoreInfoElement.textContent = `${correctAnswersCount} ✅ | ${incorrectAnswersCount} ❌`;
  }
}

// Creates quiz question elements dynamically
function quizCreator() {
  if (shouldShuffleQuestions) {
    quizArray = [...quizArray].sort(() => Math.random() - 0.5);
  }

  quizContainer.innerHTML = ''; // Clear previous content (added for safety)

  countOfQuestion.textContent = `1/${quizArray.length} question`;

  quizArray.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("container-mid", "hide");

    const questionP = document.createElement("p");
    questionP.classList.add("question");
    // Escape any < or > to prevent injection
    questionP.textContent = item.question;
    div.appendChild(questionP);

    const answerInfo = document.createElement("p");
    answerInfo.classList.add("answer-info");
    answerInfo.textContent = item.correct.length > 1
      ? "(multiple correct answers)"
      : "(single correct answer)";
    div.appendChild(answerInfo);

    const shuffledOptions = shuffleArray(item.options);
    shuffledOptions.forEach(option => {
      const button = document.createElement("button");
      button.classList.add("option-div");
      button.type = "button";
      button.textContent = option;
      button.onclick = () => checker(button);
      div.appendChild(button);
    });

    quizContainer.appendChild(div);
  });

  nextBtn.disabled = true;
  nextBtn.textContent = "Check";
}

// Fisher-Yates shuffle
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Initializes quiz state
function initial() {
  questionCount = 0;
  scoreCount = 0;
  correctAnswersCount = 0;
  incorrectAnswersCount = 0;
  isSubmitted = false;

  quizCreator();
  quizDisplay(questionCount);

  nextBtn.disabled = true;
  nextBtn.textContent = "Check";

  updateScoreDisplay();
}

// Start button to begin quiz
startButton.addEventListener("click", () => {
  shouldShuffleQuestions = document.getElementById("shuffle-questions").checked;
  startScreen.classList.add("hide");
  displayContainer.classList.remove("hide");
  loadQuizData();
});

// On page load
window.onload = () => {
  startScreen.classList.remove("hide");
  displayContainer.classList.add("hide");
};
