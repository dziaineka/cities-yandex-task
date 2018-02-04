var inGame = false;
var seconds = 0;
var mansTurn = true;

function startGame(timePerAnswer) {
    inGame = true;
    seconds = timePerAnswer;
    var timer = document.getElementById("timer");

    function tick() {
        timer.innerHTML = seconds;

        if (seconds == 0) {
            inGame = false;
            alert("Время вышло");
            return true;
        } else {
            seconds--;
        }

        if (seconds >= 0) {
            setTimeout(tick, 1000);
        }
    }

    tick();
}

function correctName(cityName) {
    return (cityName == 'Minsk');
}

function checkInput() {
    var cityName = document.getElementById("handCityInput").value;

    if (correctName(cityName)) {
        return true;
    } else {
        return false;
    }
}

function nextTurn() {
    seconds = 15;
    mansTurn = !mansTurn;

    if (mansTurn) {
        humansTurn();
    }
    else {
        machinesTurn();
    }
}

function humansTurn() {
    alert('человекоход');
}

function machinesTurn() {
    alert('машиноход');
}

function alertIncorrectCity() {
    alert('Неправильный город!');
}

function handleInput(event) {
    if (event.keyCode === 13) {
        if (checkInput()) {
            if (inGame) {
                nextTurn();
            } 
            else {
                startGame(15);
            }
        }
        else
        {
            alertIncorrectCity();
        }
    }
}

document.getElementById("handCityInput")
    .addEventListener("keyup", function (event) {
        event.preventDefault();
        handleInput(event);
    });