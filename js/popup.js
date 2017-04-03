var text = null;
var lang = null;

// Get the response for a particular service from the Textgain API
function getFromAPI(id, resp) {
  var api, req;

  api = 'https://api.textgain.com/1/' + id +
    '?q=' + text +
    (lang !== null ? '&lang=' + lang : '') +
    '&key=***';

  // Show loading image
  document.getElementById('feedback').style.display = 'block';

  req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      resp(JSON.parse(req.responseText));
      // Hide loading image
      document.getElementById('feedback').style.display = 'none';
    }
  };
  req.open('GET', api, true);
  req.send();
}

// Start to analyze the selected text in the current page
function startAnalysis(data) {
  // Remove carriage returns
  text = encodeURIComponent(data.text.replace(/\n|\r/g, ' '));
  // Check whether there is any text selected by user
  if (text === '') {
    document.getElementById('feedback').innerHTML =
      '<i class="fa fa-exclamation-triangle red" aria-hidden="true"></i> ' +
      'Please select a piece of text from any webpage and try again.';
  } else {
    getFromAPI('language', showLanguage);
    getFromAPI('genre', showGenre);
    getFromAPI('education', showEducation);
  }
}

// Inject the predicted language and confidence in the pop-up and call
// language-dependent services
function showLanguage(ans) {
  var dictLang = {
    'sq': 'Albanian',    'ar': 'Arabic',      'be': 'Belarusian',
    'bg': 'Bulgarian',   'zh': 'Chinese',     'hr': 'Croatian',
    'cs': 'Czech',       'da': 'Danish',      'nl': 'Dutch',
    'en': 'English',     'et': 'Estonian',    'fi': 'Finnish',
    'fr': 'French',      'de': 'German',      'el': 'Greek',
    'he': 'Hebrew',      'hi': 'Hindi',       'hu': 'Hungarian',
    'is': 'Icelandic',   'id': 'Indonesian',  'it': 'Italian',
    'ja': 'Japanese',    'ko': 'Korean',      'lv': 'Latvian',
    'lt': 'Lithuanian',  'mk': 'Macedonian',  'ms': 'Malay',
    'no': 'Norwegian',   'fa': 'Persian',     'pl': 'Polish',
    'pt': 'Portuguese',  'ro': 'Romanian',    'ru': 'Russian',
    'sr': 'Serbian',     'sk': 'Slovak',      'sl': 'Slovenian',
    'es': 'Spanish',     'sw': 'Swahili',     'sv': 'Swedish',
    'th': 'Thai',        'tr': 'Turkish',     'uk': 'Ukrainian',
    'vi': 'Vietnamese',  'yi': 'Yiddish'
  };

  // Set the predicted language
  lang = ans.language;

  // Run language-dependent services
  if (lang.match(/^(en|es|de|fr|nl)$/)) {
    getFromAPI('age', showAge);
  }
  if (lang.match(/^(en|es|da|de|fi|fr|it|nl|no|pl|pt|sv)$/)) {
    getFromAPI('gender', showGender);
  }
  if (lang.match(/^(en|es|ar|da|de|fr|it|ja|nl|no|pl|ru|sv|zh)$/)) {
    getFromAPI('sentiment', showSentiment);
  }
  if (lang.match(/^(en|nl)$/)) {
    getFromAPI('personality', showPersonality);
  }
  if (lang.match(/^(en|es|de|fr|it|nl)$/)) {
    getFromAPI('concepts', showConcepts);
  }

  document.getElementById('language').innerHTML =
    '<i class="fa fa-comment fa-fw" aria-hidden="true"></i> ' +
    '<span class="title">Language:</span> ' +
    dictLang[lang] +
    ' (' + ans.confidence + ')';
}

// Inject the predicted genre and confidence in the pop-up
function showGenre(ans) {
  document.getElementById('genre').innerHTML =
    '<i class="fa fa-file-text fa-fw" aria-hidden="true"></i> ' +
    '<span class="title">Genre:</span> ' +
    ans.genre +
    ' (' + ans.confidence + ')';
}

// Inject the predicted genre and confidence in the pop-up
function showEducation(ans) {
  var dictEduc = {
    '+': 'high',
    '-': 'low'
  };

  document.getElementById('education').innerHTML =
    '<i class="fa fa-puzzle-piece fa-fw" aria-hidden="true"></i> ' +
    '<span class="title">Education:</span> ' +
    dictEduc[ans.education] +
    ' (' + ans.confidence + ')';
}

// Inject the predicted age and confidence in the pop-up
function showAge(ans) {
  var dictAge = {
    '25-': 'adolescent',
    '25+': 'adult'
  };

  document.getElementById('age').innerHTML =
    '<i class="fa fa-user fa-fw" aria-hidden="true"></i> ' +
    '<span class="title">Age:</span> ' +
    dictAge[ans.age] +
    ' (' + ans.confidence + ')';
}

// Inject the predicted gender and confidence in the pop-up
function showGender(ans) {
  var dictGend = {
    'm': 'man',
    'f': 'woman'
  };

  document.getElementById('gender').innerHTML =
    '<i class="fa fa-user fa-fw" aria-hidden="true"></i> ' +
    '<span class="title">Gender:</span> ' +
    dictGend[ans.gender] +
    ' (' + ans.confidence + ')';
}

// Inject the predicted polarity and confidence in the pop-up
function showSentiment(ans) {
  document.getElementById('sentiment').innerHTML =
    '<i class="fa fa-heart fa-fw" aria-hidden="true"></i> ' +
    '<span class="title">Sentiment:</span> ' +
    ans.polarity +
    ' (' + ans.confidence + ')';
}

// Inject the predicted personality and confidence in the pop-up
function showPersonality(ans) {
  var dictPers = {
    'E': 'extraversion',
    'I': 'introversion'
  };

  document.getElementById('personality').innerHTML =
    '<i class="fa fa-puzzle-piece fa-fw" aria-hidden="true"></i> ' +
    '<span class="title">Personality:</span> ' +
    dictPers[ans.personality] +
    ' (' + ans.confidence + ')';
}

// Inject top concepts in the pop-up and link them to the Wikipedia
function showConcepts(ans) {
  var conc = ans.concepts;

  document.getElementById('concepts').innerHTML =
    '<i class="fa fa-exclamation-circle fa-fw" aria-hidden="true"></i> ' +
    '<span class="title">Concepts:</span> ';

  for (var i = 0, len = conc.length; i < len; i++) {
    document.getElementById('concepts').innerHTML +=
      '<a href="https://' + lang + '.wikipedia.org/w/index.php?search=' +
      conc[i] + '" target="_blank">#' +
      conc[i].replace(' ', '_') + '</a> ';
  }
}

// Get the selected text from the current page
window.addEventListener('load', function() {
  chrome.runtime.getBackgroundPage(function(activePage) {
    activePage.getText(startAnalysis);
  });
});
