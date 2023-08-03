//Implementing Header to every site 
async function includeHTML() {

    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    setHeaderClasses(currentQuiz)

};

let questions = [];

let currentQuiz;
let currentQuestion = 0;
let rightAnswers = 0;
let answeredQuestions = 0;
let questionsLength;
let A_answer_sucess = new Audio('sounds/answer_success.mp3');
let A_answer_fail = new Audio('sounds/answer_fail.mp3');
let A_champ_fanfare = new Audio('sounds/champ_fanfare.mp3');
let A_quiz_done = new Audio('sounds/quiz_done.mp3');



function initQuiz(currentQuiz) {
    saveQuizInLocalStorage(currentQuiz)
}

function init() {
    getQuizFromLocalStorage()
    getQuestions()
    document.getElementById('max_questions').innerHTML = questions.length;
    prepareQuestions()
    showQuestion()
}

function getQuestions() {
    let questionsArray = [dataHTML, dataCSS, dataJS, dataJava,]
    questions = questionsArray[currentQuiz]
}

function prepareQuestions() {
    for (i in questions) {
        questions[i].clicked_answer = '';
        questions[i].disabledButton = true;
    }
}


function setHeaderClasses(currentQuiz) {
    let headerPartIds = ['HTML_div', 'CSS_div', 'JS_div', 'Java_div']
    if (currentQuiz) {
        document.getElementById(headerPartIds[currentQuiz]).classList.add('side_link_choosen')
    }
}

function showQuestion() {
    document.getElementById('question_counter').innerHTML = currentQuestion + 1;
    let question = questions[currentQuestion];
    insertQuestion(question)
    readyNextButton(question)
    if (question.clicked_answer) {
        answerClasses(question.clicked_answer, 'False')
        answerClasses(question.right_answer, 'Right')
    }
}

function insertQuestion(question) {
    document.getElementById('questiontext').innerHTML = question.question
    document.getElementById('answer_1').innerHTML = question.answer_1
    document.getElementById('answer_2').innerHTML = question.answer_2
    document.getElementById('answer_3').innerHTML = question.answer_3
    document.getElementById('answer_4').innerHTML = question.answer_4
}


function answer(clickedAnswer) {
    let question = questions[currentQuestion];
    if (!question.clicked_answer) {
        question.clicked_answer = clickedAnswer;
        answeredQuestions++;
        checkIfAnswerWasRight(question, clickedAnswer)
    }
    enableNextButton(question)
    readyNextButton(question)
}


function checkIfAnswerWasRight(question, clickedAnswer) {

    if (clickedAnswer == question.right_answer) {
        answerClasses(question.right_answer, 'Right')

        countRightAnswers(1)
        A_answer_sucess.play()
    } else {
        answerClasses(clickedAnswer, 'False')
        answerClasses(question.right_answer, 'Right')
        countRightAnswers(0)
        A_answer_fail.play()
    }
}


function answerClasses(answer, frag) {
    document.getElementById('overDiv' + answer).classList.add(frag + '_answer')
    document.getElementById('answer_' + answer).classList.add(frag + '_answer')
    document.getElementById('leftPart' + answer).classList.add(frag + '_answer_left')
}


function enableNextButton(question) {
    question.disabledButton = false;
}

function readyNextButton(question) {
    document.getElementById('rightSideButton').disabled = question.disabledButton;
}


function nextQuestion(X) {

    removeAnswerClasses()

    if ((currentQuestion >= questions.length - 1) && (answeredQuestions == questions.length) && (X > 0)) {
        toResult()
    } else {
        currentQuestion += X

        if (currentQuestion < 0) {
            currentQuestion = 0
        }
        if (currentQuestion == questions.length - 1) {
            switchRightButToResultBut();
        } else if (currentQuestion == questions.length - 2) {
            switchRghtButBack()
        }

        showQuestion()
    }
}


function removeAnswerClasses() {

    let toRemoveClasses = ['False_answer', 'Right_answer', 'False_answer_left', 'Right_answer_left'];

    for (let className of toRemoveClasses) {

        let toRemove = document.getElementsByClassName(className);

        while (toRemove.length > 0) {
            toRemove[0].classList.remove(className)
        }
    }
}

function switchRightButToResultBut() {
    let rightButton = document.getElementById('rightSideButton');
    rightButton.classList.remove('Right_Arrow');
    rightButton.classList.add('Show_Result_Button');
    rightButton.innerHTML = 'Ergebnis anzeigen';
}

function switchRghtButBack() {
    let rightButton = document.getElementById('rightSideButton');
    rightButton.classList.add('Right_Arrow');
    rightButton.classList.remove('Show_Result_Button');
    rightButton.innerHTML = '';
}


function countRightAnswers(x) {
    rightAnswers += x;
}

function rightButtonDisplay() {
    document.getElementById('rightSideButton').innerHTML = 'Ergebnis'
}


function toResult() {
    saveQuizInLocalStorage(currentQuiz)
    saveResultInLocalStorage()
    window.location.replace("./result.html")
}


function getResult() {
    getQuizFromLocalStorage()
    getResultFromLocalStorage()
    showResult()
    readyReplayButton()
}

function showResult() {
    let quizArray = ['HTML', 'CSS', 'JAVASCRIPT', 'JAVA',]
    document.getElementById('cWichQuiz').innerHTML = quizArray[currentQuiz] + ' QUIZ'
    document.getElementById('scoreCounter').innerHTML = rightAnswers + '/' + questionsLength
}

function readyReplayButton() {
    document.getElementById('Replay_id').innerHTML = /*html*/`
    <a href="./quizPage.html" onclick="initQuiz(${currentQuiz})"> REPLAY</a>
   `
}

function dismantleResult() {
    document.querySelector('.Result_OverDiv').style.display = 'none'
    playReward()
}

function playReward() {
    if (rightAnswers == questionsLength) {

        A_champ_fanfare.play()
    } else {
        A_quiz_done.play()
    }
}


function saveQuizInLocalStorage(currentQuiz) {
    localStorage.setItem('currentQuiz', JSON.stringify(currentQuiz));
}


function getQuizFromLocalStorage() {
    let currentQuizFromStorage = localStorage.getItem('currentQuiz');

    if (currentQuizFromStorage) {

        let test = JSON.parse(currentQuizFromStorage)
        currentQuiz = test
        localStorage.removeItem(currentQuiz);
    }
}

function saveResultInLocalStorage() {
    localStorage.setItem('rightAnswers', JSON.stringify(rightAnswers));
    localStorage.setItem('questionsLength', JSON.stringify(questions.length));

}

function getResultFromLocalStorage() {
    let questionsLengthFromLocalStorage = localStorage.getItem('questionsLength');
    let rightAnswersFromLocalStorage = localStorage.getItem('rightAnswers');

    if (rightAnswersFromLocalStorage) {
        let test1 = JSON.parse(rightAnswersFromLocalStorage)
        rightAnswers = test1
        localStorage.removeItem(rightAnswers);
    }
    if (questionsLengthFromLocalStorage) {
        let test2 = JSON.parse(questionsLengthFromLocalStorage)
        questionsLength = test2
        localStorage.removeItem(questionsLength);
    }
}

function toggleHeader() {

    //document.querySelector('.OpenDiv').classList.toggle('Resp_Display_none');

    document.getElementById('hamburger').classList.toggle('Resp_Display_none');
    document.querySelector('.transform').classList.toggle('transform-active');
    document.querySelector('.transform').classList.toggle('ShowNothing');

}
