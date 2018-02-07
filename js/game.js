var timeByTurn = 10;
var inGame = false;
var seconds = timeByTurn;
var mansTurn = true;
var usedCities = [];
var inputField = document.getElementById("handCityInput");
var timerView = document.getElementById("timer");
var timerExpiredEvent = new Event('timerExpired');

document.addEventListener('timerExpired', stopGame);

function stopGame() {
    inGame = false;
    mansTurn = true;
    usedCities = [];
    seconds = timeByTurn;
    alert("Время вышло");
    swichToBigScale();
}

function startGame() {
    inGame = true;

    var timer = setInterval(() => {
        timerView.innerHTML = seconds;

        if (seconds == 0) {
            clearInterval(timer);
            document.dispatchEvent(timerExpiredEvent);
        }

        seconds--;
    }, 1000);
}

function checkInput() {
    var cityName = document.getElementById("handCityInput").value;
    cityName = cityName.toLowerCase();

    if (usedCities.includes(cityName)) {
        return false;
    }

    if (cityData.includes(cityName)) {
        usedCities.push(cityName);
        addCityToMap(cityName);
        return true;
    }

}

function humansTurn() {
    inputField.removeAttribute('readonly');
}

function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

function imitatePrinting(cityName) {
    function addButton(res) {
        document.getElementById("handCityInput").value += element;
        resolve(res);
    }

    for (var index = 0; index < cityName.length; index++) {
        var element = cityName[index];

        sleep(Math.random() * 800).then(addButton(res));
    }
}

function machinesTurn() {
    inputField.setAttribute('readonly', '');
    var index = Math.ceil((Math.random() * cityData.length) + 1);
    var properCity = cityData[index];

    imitatePrinting(properCity);

    if (!handleInput()) {
        machinesTurn();
    }
}

function clearInputField() {
    document.getElementById("handCityInput").value = '';
}

function nextTurn() {
    seconds = timeByTurn;
    clearInputField();
    mansTurn = !mansTurn;

    if (mansTurn) {
        humansTurn();
    } else {
        machinesTurn();
    }
}

function highlightInputField(color) {
    var inputField = document.getElementById("handCityInput");
    inputField.style.backgroundColor = color;

    sleep(500).then(() => {
        clearInputField();
        inputField.style.backgroundColor = "";
    });
}

function handleInput() {
    if (!inGame) {
        return false;
    }

    if (checkInput()) {
        highlightInputField('green');
        nextTurn();
        return true;
    } else {
        highlightInputField('red');
        return false;
    }
}

function resetGame() {
    usedCities = [];
    myMap.geoObjects.removeAll();
    seconds = timeByTurn;
}

function catchInput(event) {
    if (mansTurn) {
        if (event.keyCode === 13) {
            if (!inGame) {
                resetGame();
                startGame();
            }

            handleInput();
        }
    }

}

document.getElementById("handCityInput")
    .addEventListener("keyup", function (event) {
        event.preventDefault();
        catchInput(event);
    });