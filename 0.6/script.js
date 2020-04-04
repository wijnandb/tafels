var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

$(function(){
	if (SpeechRecognition) {
		$(".warnings")
			.html("Cool!  Your browser supports speech recognition.  Have fun!");
	} else {
		$(".warnings")
			.addClass("unsupported")
			.html("Sorry... Your browser doesn't support speech recognition yet.");
	}
});

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

// fill an array with sums
var keersommen = [
  [5,3],	[10,8],	[9,3],	[4,2],	[9,4],	[2,1],	[8,9],	[6,10],	[5,6],	[2,10],
[3,3],	[4,8],	[7,3],	[1,2],	[7,4],	[8,1],	[6,9],	[5,9],	[3,6],	[8,10],
[10,3],	[1,8],	[2,3],	[9,2],	[2,4],	[6,1],	[5,1],	[3,9],	[10,5],	[10,6],
[4,3],	[9,8],	[8,3],	[7,2],	[8,4],	[5,4],	[3,1],	[10,9],	[4,5],	[4,6],
[1,3],	[7,8],	[6,3],	[2,2],	[6,4],	[3,4],	[10,1],	[4,9],	[1,5],	[1,6],
[5,7],	[2,8],	[9,7],	[8,2],	[5,2],	[10,4],	[4,1],	[1,9],	[9,5],	[9,6],
[3,7],	[8,8],	[7,7],	[6,2],	[3,2],	[4,4],	[1,1],	[9,9],	[7,5],	[7,6],
[10,7],	[6,8],	[2,7],	[5,8],	[10,2],	[1,4],	[9,1],	[7,9],	[2,5],	[2,6],
[4,7],	[5,5],	[8,7],	[3,8],	[1,10],	[10,10],	[7,1],	[2,9],	[8,5],	[8,6],
[1,7],	[3,5],	[6,7],	[7,10],	[9,10],	[4,10],	[3,10],	[5,10],	[6,5],	[6,6]
]



function testSpeech() {
  testBtn.disabled = false;
  testBtn.textContent = 'stop';

  // get a random su from the array "keersommen"
  document.getElementById("total").innerHTML = aantal_sommen;
  randomsom = aantal_sommen;

  times = keersommen[randomsom][0];
  toMult = keersommen[randomsom][1];
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
//    document.getElementById("total").innerHTML = aantal_sommen;
    resultPara.textContent = speechResult;
    if(parseInt(speechResult, 10) === phrase) {
      delete keersommen[randomsom];
      tafels[times][toMult] = tafels[times][toMult] + 1;
      setColor(somvakje, tafels[times][toMult]);
      aantal_goed = aantal_goed + 1;
      document.getElementById("correct").innerHTML = aantal_goed;
    } else {
      resultPara.textContent = speechResult;
      tafels[times][toMult] = tafels[times][toMult] - 1;
      setColor(somvakje, tafels[times][toMult]);
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
    testSpeech()
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
    diagnosticPara.textContent = 'Fout in spraakherkenning: ' + event.error;
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

var colors = ["red", "orange", "yellow", "lightgrey", "lawngreen", "green"]

function setColor(element, stage)
{
    element.style.backgroundColor = colors[stage];
}


var tafels = [
  ["score van alle tafels"],
  ["tafel van 1", 3,3,3,3,3,3,3,3,3,3],
  ["tafel van 2", 3,3,3,3,3,3,3,3,3,3],
  ["tafel van 3", 3,3,3,3,3,3,3,3,3,3],
  ["tafel van 4", 3,3,3,3,3,3,3,3,3,3],
  ["tafel van 5", 3,3,3,3,3,3,3,3,3,3],
  ["tafel van 6", 3,3,3,3,3,3,3,3,3,3],
  ["tafel van 7", 3,3,3,3,3,3,3,3,3,3],
  ["tafel van 8", 3,3,3,3,3,3,3,3,3,3],
  ["tafel van 9", 3,3,3,3,3,3,3,3,3,3],
  ["tafel van 10", 3,3,3,3,3,3,3,3,3,3],
]

