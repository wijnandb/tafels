var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var phrasePara = document.querySelector('.phrase');
var resultPara = document.querySelector('.result');
//var diagnosticPara = document.querySelector('.output');
var diagnosticPara = document.getElementById('progress-correct');
var diagnosticParb = document.getElementById('progress-wrong');
var diagnosticParc = document.getElementById('progress-understood');

var testBtn = document.querySelector('button');

var aantal_sommen = 0;
document.getElementById("total").innerHTML = aantal_sommen;
var aantal_goed = 0;
document.getElementById("correct").innerHTML = aantal_goed;
var aantal_fout = 0;
document.getElementById("wrong").innerHTML = aantal_fout;

function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = '';

  times = Math.floor(Math.random() * 10) + 1;
  toMult = Math.floor(Math.random() * 10) + 1;
  var somvakje = document.getElementById(+ times + '.' + toMult);
  var phrase = times*toMult;
  phrasePara.textContent = "Hoeveel is " + times +  " x " + toMult + " ?";
//  resultPara.textContent = 'Goed of fout?';
//  resultPara.style.background = 'rgba(0,0,0,0.2)';
//  diagnosticPara.textContent = '...luisteren...';


  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'nl-NL';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object 
    var speechResult = event.results[0][0].transcript;
    aantal_sommen += 1
    document.getElementById("total").innerHTML = aantal_sommen;
    if(parseInt(speechResult, 10) === phrase) {
      resultPara.textContent = speechResult;
      setColor(somvakje, 'lawngreen');
      aantal_goed = aantal_goed + 1;
      document.getElementById("correct").innerHTML = aantal_goed;
    } else {
      setColor(somvakje, 'red');
      aantal_fout = aantal_fout + 1;
      document.getElementById("wrong").innerHTML = aantal_fout;
    }

    console.log('Zekerheid: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    // hier kun je een timer inzetten die na halve seconde nieuw woord geeft
    // nu zo aangepast dat automatisch nieuw woord wordt gevraagd
    // onderstaande drie waren ongecomment in origineel
  //  recognition.stop();
  //  testBtn.disabled = false;
  //  testBtn.textContent = 'Start new test';
  // hierdoor wordt nieuw woord gevraagd, toegevoegd als alternatief
  if (aantal_sommen < 10) {
    testSpeech()
    }
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
//    diagnosticPara.textContent = 'Fout in spraakherkenning: ' + event.error;
  }
  
  recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
  }
  
  recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
  }
  
  recognition.onend = function(event) {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
  }
  
  recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
  }
  
  recognition.onsoundstart = function(event) {
      //Fired when any sound — recognisable speech or not — has been detected.
      console.log('SpeechRecognition.onsoundstart');
  }
  
  recognition.onsoundend = function(event) {
      //Fired when any sound — recognisable speech or not — has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
  }
  
  recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');
  }
}

testBtn.addEventListener('click', testSpeech);

function setColor(element, color)
{
    element.style.backgroundColor = color;
}

