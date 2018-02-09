function startVoiceRecognition() {
    recognition.start();
    voiceUsed = true;
    // voiceInputButton.style.
    console.log('Ready to receive a color command.');
}

if (navigator.userAgent.toLowerCase().indexOf('webkit') == -1) {
    document.getElementById("speechButton").style.display = 'none';
    document.getElementsByClassName("speechInput")[0].style.display = 'none';
    document.getElementById("handCityInput").style.width = '100%';
} else {
    // если это вебкит, то загружаем голос
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
    var voiceInputButton = document.getElementById("speechButton");


    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();

    recognition.lang = 'ru';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    console.log('Click then say a to change the background ' +
        'color of the app.');

    voiceInputButton.onclick = startVoiceRecognition;

    recognition.onresult = function (event) {
        // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
        // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
        // It has a getter so it can be accessed like an array
        // The [last] returns the SpeechRecognitionResult at the last position.
        // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
        // These also have getters so they can be accessed like arrays.
        // The [0] returns the SpeechRecognitionAlternative at position 0.
        // We then return the transcript property of the SpeechRecognitionAlternative object

        var last = event.results.length - 1;
        var voiceStr = event.results[last][0].transcript;

        console.log('Result received: ' + voiceStr + '.');
        console.log('Confidence: ' + event.results[0][0].confidence);

        inputField.value = voiceStr.trim();
        sleep(1500).then(catchInput());
    };

    recognition.onspeechend = function () {
        recognition.stop();
    };

    recognition.onnomatch = function (event) {
        console.log("I didn't recognise that color.");
    };

    recognition.onerror = function (event) {
        console.log('Error occurred in recognition: ' + event.error);
    };
}