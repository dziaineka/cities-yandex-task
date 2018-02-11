var timeByTurn = 30;
var inGame = false;
var seconds = timeByTurn;
var mansTurn = true;
var usedCities = [];
var botCity = '';
var inputField = document.getElementById("handCityInput");
var voiceInputButton = document.getElementById("speechButton");
var timerView = document.getElementById("timer");
var timerExpiredEvent = new Event('timerExpired');
var botEnteredEvent = new Event('botEntered');
var botFoundCityEvent = new Event('botFoundCity');
var neededLetter = '';
var voiceUsed = false;

document.addEventListener('timerExpired', stopGame);
document.addEventListener('botEntered', handleInput);
document.addEventListener('botFoundCity', imitatePrinting);

function getEndString() {
  if (mansTurn) {
    return 'Победили машины!';
  } else {
    return 'Победило человечество!';
  }
}

function stopGame() {
  timerView.innerHTML = getEndString();
  inGame = false;
  mansTurn = true;
  inputField.removeAttribute('readonly');
  neededLetter = '';
  clearInputField();
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

function saveLastButton(cityName) {
  var lastButton = cityName[cityName.length - 1];

  if (['ь', 'ъ', 'ы', 'й'].includes(lastButton)) {
    // сохраним предпоследнюю букву, раз последняя не подходит
    saveLastButton(cityName.substr(0, cityName.length - 1));
  } else {
    neededLetter = cityName[cityName.length - 1];
  }
}

function checkInput() {
  var cityName = inputField.value;
  cityName = cityName.toLowerCase();

  if (usedCities.includes(cityName)) {
    return false;
  }

  if (neededLetter != '' &&
    neededLetter != cityName[0]) {
    return false;
  }

  if (cityData.includes(cityName)) {
    usedCities.push(cityName);
    addCityToMap(cityName);
    saveLastButton(cityName);
    return true;
  }

}

function humansTurn() {
  inputField.removeAttribute('readonly');

  if (voiceUsed) {
    startVoiceRecognition();
  }
}

function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

async function imitatePrinting() {
  var cityName = botCity;

  function addButton() {
    inputField.value += element;
  }

  if (!inGame) {
    return;
  }

  // печатаем без первой буквы, она уже введена
  for (var index = 1; index < cityName.length; index++) {
    var element = cityName[index];

    await sleep(Math.random() * 800);
    addButton();
  }

  await sleep(1000);

  document.dispatchEvent(botEnteredEvent);
}

function startThinkingVisualization() {
  var visualization = setInterval(() => {
    if (inputField.value.length == 4) {
      inputField.value = inputField.value[0];
    } else {
      inputField.value += '.';
    }
  }, 1000);

  return visualization;
}

function stopThinkingVisualization(visualization) {
  clearInterval(visualization);
  inputField.value = inputField.value[0];
}

function findCity() {
  var index;
  var visID = startThinkingVisualization();

  var finder = setInterval(() => {
    index = Math.ceil((Math.random() * cityData.length) + 1);
    var name = cityData[index];

    if (!inGame) {
      clearInterval(visID);
      clearInterval(finder);
    }

    if (name[0] == neededLetter) {
      clearInterval(finder);
      botCity = name;
      stopThinkingVisualization(visID);
      document.dispatchEvent(botFoundCityEvent);
    }
  }, 300);
}

function machinesTurn() {
  inputField.setAttribute('readonly', '');

  findCity();
}

function clearInputField() {
  inputField.value = neededLetter.toUpperCase();
}

function nextTurn(success) {
  if (success) {
    seconds = timeByTurn;
    mansTurn = !mansTurn;
  }

  clearInputField();

  if (mansTurn) {
    humansTurn();
  } else {
    machinesTurn();
  }
}

function highlightInputField(color) {
  inputField.style.backgroundColor = color;

  sleep(500).then(() => {
    clearInputField();
    inputField.style.backgroundColor = "";
  });
}

function handleInput() {
  if (!inGame) {
    return;
  }

  if (checkInput()) {
    highlightInputField('green');
    nextTurn(true);
  } else {
    highlightInputField('red');
    nextTurn(false);
  }
}

function resetGame() {
  usedCities = [];
  myMap.geoObjects.removeAll();
  seconds = timeByTurn;
  botCity = '';
}

function catchInput() {
  if (!inGame) {
    resetGame();
    startGame();
  }

  handleInput();
}

inputField.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (mansTurn) {
    if (event.keyCode === 13) {
      voiceUsed = false;
      recognition.stop();
      catchInput();
    }
  }
});

// голосовой ввод