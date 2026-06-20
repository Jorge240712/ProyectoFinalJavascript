// ======================================
// LINGOQUEST PRO
// APP.JS
// ======================================

let player = null;

let exercises = [];
let currentQuestion = 0;

let placementIndex = 0;
let placementScore = 0;

// ======================================
// ELEMENTOS
// ======================================

const welcomeScreen =
document.getElementById("welcomeScreen");

const placementScreen =
document.getElementById("placementScreen");

const dashboardScreen =
document.getElementById("dashboardScreen");

const lessonScreen =
document.getElementById("lessonScreen");

const rewardModal =
document.getElementById("rewardModal");

// ======================================
// TEST NIVELACIÓN
// ======================================

const placementQuestions = [

{
question:"What time ___ you wake up?",
correct:"do",
options:["do","does","is","are"]
},

{
question:"She has lived here ___ 2018.",
correct:"since",
options:["for","since","during","from"]
},

{
question:"If I had more money, I ___ travel.",
correct:"would",
options:["will","would","am","did"]
},

{
question:"I wish I ___ taller.",
correct:"were",
options:["was","were","am","be"]
},

{
question:"The report must ___ today.",
correct:"be finished",
options:[
"be finished",
"finished",
"finish",
"finishing"
]
}

];

// ======================================
// INICIO
// ======================================

document.addEventListener(
"DOMContentLoaded",
init
);

function init(){

   player = Storage.loadPlayer();

    if(player){

    if(player.placementCompleted){

        showDashboard();

    }else{

        startPlacement();

    }

}

}

// ======================================
// IDIOMAS
// ======================================

document
.querySelectorAll(".language-card")
.forEach(card=>{

card.addEventListener(
"click",
()=>{

document
.querySelectorAll(".language-card")
.forEach(c=>
c.classList.remove("selected")
);

card.classList.add("selected");

});

});

// ======================================
// COMENZAR
// ======================================

document
.getElementById("startBtn")
.addEventListener(
"click",
startGame
);

function startGame(){

const name =
document
.getElementById("playerName")
.value
.trim();

if(!name){

alert(
"Ingresa tu nombre"
);

return;

}

const language =

document.querySelector(
".language-card.selected"
).dataset.lang;

player =
Storage.createPlayer(
name,
language
);

startPlacement();

}

// ======================================
// TEST NIVELACIÓN
// ======================================

function startPlacement(){

welcomeScreen.classList.remove(
"active"
);

placementScreen.classList.add(
"active"
);

placementIndex = 0;
placementScore = 0;

renderPlacement();

}

function renderPlacement(){

const q =
placementQuestions[
placementIndex
];

const container =
document.getElementById(
"placementQuestion"
);

document.getElementById(
"placementProgress"
).style.width =

`${(placementIndex /
placementQuestions.length)
*100}%`;

container.innerHTML =

`
<h2>${q.question}</h2>

<div class="options">

${q.options.map(
option=>`

<button
class="option-btn">

${option}

</button>

`
).join("")}

</div>
`;

document
.querySelectorAll(
".option-btn"
)
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

if(
btn.textContent.trim()
=== q.correct
){

placementScore++;

}

placementIndex++;

if(
placementIndex >=
placementQuestions.length
){

finishPlacement();

}
else{

renderPlacement();

}

}
);

});

}

function finishPlacement(){

let level = "A1";

if(placementScore >= 2)
level = "A2";

if(placementScore >= 4)
level = "B1";

if(placementScore === 5)
level = "B2";

Storage.setEnglishLevel(
level
);

player =
Storage.loadPlayer();

document
.getElementById(
"placementQuestion"
)
.innerHTML = "";

document
.getElementById(
"placementResult"
)
.classList.remove(
"hidden"
);

document
.getElementById(
"levelResult"
)
.textContent =

`Tu nivel es ${level}`;

}

document
.getElementById(
"startLearningBtn"
)
.addEventListener(
"click",
showDashboard
);

// ======================================
// DASHBOARD
// ======================================

function showDashboard(){

placementScreen.classList.remove(
"active"
);

welcomeScreen.classList.remove(
"active"
);

lessonScreen.classList.remove(
"active"
);

dashboardScreen.classList.add(
"active"
);

updateUI();

}

// ======================================
// ACTUALIZAR UI
// ======================================

function updateUI(){

player =
Storage.loadPlayer();

if(!player) return;

document.getElementById(
"playerDisplay"
).textContent =
player.name;

document.getElementById(
"playerRank"
).textContent =
`Nivel ${player.levelName}`;

document.getElementById(
"selectedLanguage"
).textContent =
player.language;

document.getElementById(
"xp"
).textContent =
player.xp;

document.getElementById(
"coins"
).textContent =
player.coins;

document.getElementById(
"hearts"
).textContent =
player.hearts;

document.getElementById(
"streak"
).textContent =
player.streak;

document.getElementById(
"level"
).textContent =
player.level;

document.getElementById(
"profileLevel"
).textContent =
player.level;

document.getElementById(
"completedLessons"
).textContent =
player.completedLessons;

document.getElementById(
"accuracy"
).textContent =
`${Storage.getAccuracy()}%`;

document.getElementById(
"studyTime"
).textContent =
`${player.studyTime} min`;

document.getElementById(
"xpBar"
).style.width =
`${player.xp % 100}%`;

}

// ======================================
// LECCIONES
// ======================================

document
.querySelectorAll(
".lesson-node.unlocked"
)
.forEach(node=>{

node.addEventListener(
"click",
startLesson
);

});

async function startLesson(){

dashboardScreen.classList.remove(
"active"
);

lessonScreen.classList.add(
"active"
);

currentQuestion = 0;

exercises =
await API.createExercises();

renderQuestion();

}

function renderQuestion(){

const q =
exercises[currentQuestion];

document.getElementById(
"lessonProgress"
).style.width =

`${(currentQuestion /
exercises.length)*100}%`;

document.getElementById(
"questionContainer"
).innerHTML =

`
<h2>${q.question}</h2>

<div class="options">

${q.options.map(
option=>`

<button
class="option-btn">

${option}

</button>

`
).join("")}

</div>
`;

document
.querySelectorAll(
".option-btn"
)
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

checkAnswer(
btn.textContent.trim(),
q.correct
);

});

});

}

function checkAnswer(
selected,
correct
){

if(selected === correct){

Storage.addCorrectAnswer();

Storage.addXP(25);

Storage.addCoins(10);

}
else{

Storage.addWrongAnswer();

Storage.loseHeart();

}

currentQuestion++;

if(
currentQuestion >=
exercises.length
){

finishLesson();

return;

}

renderQuestion();

}

// ======================================
// FIN LECCIÓN
// ======================================

function finishLesson(){

Storage.completeLesson();

Storage.addStreak();

Storage.addStudyTime(5);

player =
Storage.loadPlayer();

document.getElementById(
"rewardText"
).textContent =

`+100 XP | +40 monedas`;

rewardModal.style.display =
"flex";

updateUI();

}

document
.getElementById(
"continueBtn"
)
.addEventListener(
"click",
()=>{

rewardModal.style.display =
"none";

showDashboard();

});

// ======================================
// VOLVER
// ======================================

document
.getElementById(
"backBtn"
)
.addEventListener(
"click",
showDashboard
);

// ======================================
// TEMA
// ======================================

document
.getElementById(
"themeBtn"
)
.addEventListener(
"click",
()=>{

document.body.classList.toggle(
"dark"
);

const theme =

document.body.classList.contains(
"dark"
)

? "dark"
: "light";

Storage.saveTheme(
theme
);

});

function loadTheme(){

const theme =
Storage.loadTheme();

if(theme === "dark"){

document.body.classList.add(
"dark"
);

}

}

// ======================================
// RESET
// ======================================

document
.getElementById(
"resetBtn"
)
.addEventListener(
"click",
()=>{

if(
confirm(
"¿Borrar progreso?"
)
){

Storage.resetAll();

location.reload();

}

});