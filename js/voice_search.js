let speechBlinking;
let SpeechRecognition;
let SpeechRecognitionEvent;
let recognition;

const noWebkit = (navigator.userAgent.toLowerCase().indexOf('webkit') === -1) ||
  (navigator.userAgent.toLowerCase().indexOf('edge') !== -1);

function blinkSpeechButton() {
  const currentBgrnd = speechButton.style.backgroundColor;
  speechButton.style.backgroundColor = 'red';

  sleep(500).then(() => {
    speechButton.style.backgroundColor = currentBgrnd;
  });
}

function abortRecognition() {
  try {
    recognition.abort();    
  } catch (error) {
    //
  }
}

function startVoiceRecognition() {
  if (!mansTurn) {
    return;
  }

  voiceUsed = true;
  recognition.abort();
  recognition.start();
  // console.log('Ready to receive a command.');
  speechBlinking = setInterval(blinkSpeechButton, 1000);
}

if (noWebkit) {
  document.getElementById('speechButton').style.display = 'none';
  document.getElementsByClassName('speechInput')[0].style.display = 'none';
  document.getElementById('handCityInput').style.width = '100%';
}

try {
  SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
  recognition = new SpeechRecognition();
} catch (error) {
  //
}

recognition.lang = 'ru';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// console.log('Click then say a city');

voiceInputButton.onclick = startVoiceRecognition;

recognition.onresult = (event) => {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The [last] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains
  // SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object

  const last = event.results.length - 1;
  const voiceStr = event.results[last][0].transcript;

  // console.log(`Result received: ${voiceStr}.`);
  // console.log(`Confidence: ${event.results[0][0].confidence}`);

  inputField.value = voiceStr.trim();
  clearInterval(speechBlinking);
  setTimeout(catchInput, 1500);
};

recognition.onspeechend = () => {
  recognition.stop();
  // console.log('Recognition stopped');
  clearInterval(speechBlinking);
};

recognition.onnomatch = () => {
  // console.log("I didn't recognise that city.");
  clearInterval(speechBlinking);
};

recognition.onerror = (event) => {
  // console.log(`Error occurred in recognition: ${event.error}`);
  clearInterval(speechBlinking);
};

recognition.onend = () => {
  // console.log('Speech recognition service disconnected');
  clearInterval(speechBlinking);
};
