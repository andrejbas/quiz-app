function gameOver(winFlag, score) {
    let gameOver = document.getElementById("game-over");
    gameOver.style.display = "block";
    let overlay = document.getElementById("overlay");
    overlay.style.display = "block";
    gameOver.style.zIndex = 1000;
    gameOver.style.position = "fixed";
    let scorePoint = document.createElement("h2");
    if (!winFlag) {
        scorePoint.innerHTML = `Your final score is ${score}/10`;
    } else {
        scorePoint.innerHTML = `You won! Your final score is 10/10`;
    }
    gameOver.appendChild(scorePoint);
    let highScore = localStorage.getItem("score");
    if (highScore === null || isNaN(parseInt(highScore))) {
        highScore = 0;
    } else {
        highScore = parseInt(highScore);
    }
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("score", highScore);
    }
    let highScorePoint = document.createElement("p");
    highScorePoint.innerHTML = `Your high score is ${highScore}`;
    gameOver.appendChild(highScorePoint);
    let button = document.createElement("button");
    button.innerHTML = "Go Again";
    gameOver.appendChild(button);
    button.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.reload();
    });
}

function displayQuestions(data) {
    let defaultLives = 3;
    let score = 0;
    let winFlag = false;

    let questions = data.results.sort(() => 0.5 - Math.random()).slice(0, 10);

    for (let i = 0; i < questions.length; i++) {
        let answers = [];
        let question = questions[i].question;
        let h2 = document.createElement("h2");
        h2.innerHTML = question;
        document.body.appendChild(h2);

        if (questions[i].type === "multiple") {
            for (let j = 0; j < questions[i].incorrect_answers.length; j++) {
                answers.push(questions[i].incorrect_answers[j]);
            }
            answers.push(questions[i].correct_answer);
            for (let j = answers.length - 1; j >= 0; j--) {
                let randomIndex = Math.floor(Math.random() * (j + 1));
                [answers[j], answers[randomIndex]] = [
                    answers[randomIndex],
                    answers[j],
                ];
            }
        } else if (questions[i].type === "boolean") {
            answers.push(questions[i].incorrect_answers[0]);
            answers.push(questions[i].correct_answer);
            for (let j = answers.length - 1; j >= 0; j--) {
                let randomIndex = Math.floor(Math.random() * (j + 1));
                [answers[j], answers[randomIndex]] = [
                    answers[randomIndex],
                    answers[j],
                ];
            }
        }

        for (let j = 0; j < answers.length; j++) {
            let p = document.createElement("p");
            p.innerHTML = answers[j];
            document.body.appendChild(p);
            p.addEventListener("click", function (e) {
                if (this.classList.contains("correct") || this.classList.contains("wrong")) {
                    return;
                }
                e.preventDefault();
                if (answers[j] === questions[i].correct_answer) {
                    p.classList.add("correct");
                    score++;
                    let scorePoint = document.getElementById("score-value");
                    scorePoint.innerHTML = score;
                    if (score === 10) {
                        gameOver(true, score);
                        winFlag = true
                    }
                } else {
                    p.classList.add("wrong");
                    defaultLives--;
                    let livesPoint = document.getElementById("lives-value");
                    livesPoint.innerHTML = defaultLives;
                    if (defaultLives === 0) {
                        gameOver(false, score);

                    }
                }
            });
        }
    }
}

fetch("src/data/questions.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        displayQuestions(data);
    })
    .catch(function (err) {
        console.log("Ova e err", err);
    });
