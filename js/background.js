function getText(callback) {
  chrome.tabs.executeScript(null, { code: "chrome.runtime.sendMessage({ 'text': window.getSelection().toString() });" });
  chrome.runtime.onMessage.addListener(function(message) {
    callback(message);
  });
};
