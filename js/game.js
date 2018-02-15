const timeByTurn = 30;
let inGame = false;
let seconds = timeByTurn;
let mansTurn = true;
let usedCities = [];
let botCity = '';
const inputField = document.getElementById('handCityInput');
const voiceInputButton = document.getElementById('speechButton');
const timerView = document.getElementById('timer');
const timerExpiredEvent = new Event('timerExpired');
const botEnteredEvent = new Event('botEntered');
const botFoundCityEvent = new Event('botFoundCity');
let neededLetter = '';
let voiceUsed = false;
const forbiddenSymbols = ['ь', 'ъ', 'ы', 'й', '(', ')', '!', '?', '.', ',', ';', ':'];

function getEndString() {
  if (mansTurn) {
    return 'Победили машины!';
  }
  return 'Победило человечество!';
}

function clearInputField() {
  inputField.value = neededLetter.toUpperCase();
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

  const timer = setInterval(() => {
    timerView.innerHTML = seconds;

    if (seconds === 0) {
      clearInterval(timer);
      document.dispatchEvent(timerExpiredEvent);
    }

    seconds -= 1;
  }, 1000);
}

function saveLastButton(cityName) {
  const lastButton = cityName[cityName.length - 1];

  if (forbiddenSymbols.includes(lastButton)) {
    // сохраним предпоследнюю букву, раз последняя не подходит
    saveLastButton(cityName.substr(0, cityName.length - 1));
  } else {
    neededLetter = cityName[cityName.length - 1];
  }
}

function checkInput() {
  let cityName = inputField.value;
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

  return false;
}

function humansTurn() {
  inputField.removeAttribute('readonly');

  if (voiceUsed) {
    startVoiceRecognition();
  }
}

function sleep(ms) {
  return new Promise(((resolve) => {
    setTimeout(resolve, ms);
  }));
}

async function imitatePrinting() {
  const cityName = botCity;

  function addButton(character) {
    inputField.value += character;
  }

  if (!inGame) {
    return;
  }

  // печатаем без первой буквы, она уже введена
  for (let index = 1; index < cityName.length; index++) {
    const element = cityName[index];

    await sleep(Math.random() * 800);
    addButton(element);
  }

  await sleep(1000);

  document.dispatchEvent(botEnteredEvent);
}

function startThinkingVisualization() {
  const visualization = setInterval(() => {
    if (inputField.value.length === 4) {
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
  let index;
  const visID = startThinkingVisualization();

  const finder = setInterval(() => {
    index = Math.ceil((Math.random() * cityData.length) + 1);
    const name = cityData[index];

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
  }, 250);
}

function machinesTurn() {
  inputField.setAttribute('readonly', '');

  findCity();
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
    inputField.style.backgroundColor = '';
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

document.addEventListener('timerExpired', stopGame);
document.addEventListener('botEntered', handleInput);
document.addEventListener('botFoundCity', imitatePrinting);

inputField.addEventListener('keyup', (event) => {
  event.preventDefault();
  if (mansTurn) {
    if (event.keyCode === 13) {
      voiceUsed = false;
      abortRecognition();
      catchInput();
    }
  }
});

// голосовой ввод
