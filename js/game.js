var timeByTurn = 10;
var inGame = false;
var seconds = timeByTurn;
var mansTurn = true;
var usedCities = [];
var inputField = document.getElementById("handCityInput");

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
    usedCities = [];
    var timer = document.getElementById("timer");
    myMap.geoObjects.removeAll();

    function tick() {
        timer.innerHTML = seconds;

        if (seconds == 0) {
            stopGame();
            return;
        } else {
            seconds--;
        }

        if (seconds >= 0) {
            setTimeout(tick, 1000);
        }
    }

    tick();
}

function checkInput() {
    var cityName = document.getElementById("handCityInput").value;
    cityName = cityName.toLowerCase();

    if (usedCities.includes(cityName)) {
        return false;
    }

    if (addCityToMap(cityName)) {
        usedCities.push(cityName);
        return true;
    } else {
        return false;
    }
}

function humansTurn() {
    inputField.removeAttribute('readonly');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function imitatePrinting(cityName) {        
    for (let index = 0; index < cityName.length; index++) {
        const element = cityName[index];
        
        document.getElementById("handCityInput").value += element; 
        await sleep(Math.random() * 800); 
    }
}

async function machinesTurn() {
    inputField.setAttribute('readonly', '');
    var index = Math.ceil((Math.random() * cityData.length) + 1);
    var properCity = cityData[index];

    await imitatePrinting(properCity);

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

async function alertIncorrectCity() {
    var inputField = document.getElementById("handCityInput");
    inputField.style.backgroundColor = "red";
    
    await sleep(1500);

    clearInputField();
    inputField.style.backgroundColor = "";
}

async function handleInput() {
    if (checkInput()) {
        if (!inGame) {
            startGame();
        }

        nextTurn();
        return true;
    } else {
        await alertIncorrectCity();
        return false;
    }
}

async function catchInput(event) {
    if (mansTurn) {
        if (event.keyCode === 13) {
            await handleInput();
        }
    }

}

document.getElementById("handCityInput")
    .addEventListener("keyup", function (event) {
        event.preventDefault();
        catchInput(event);
    });