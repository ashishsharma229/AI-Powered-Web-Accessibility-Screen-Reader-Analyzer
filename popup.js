// Filename: popup.js

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveApiKeyButton = document.getElementById('saveApiKey');
  const suggestionsDiv = document.getElementById('suggestions');

  // Load the stored API key if it exists
  chrome.storage.local.get(['openaiApiKey'], (result) => {
    if (result.openaiApiKey) {
      apiKeyInput.value = result.openaiApiKey;
    }
  });

  // Save the API key when the user clicks the "Save API Key" button
  saveApiKeyButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.local.set({ openaiApiKey: apiKey }, () => {
        alert('API Key saved!');
      });
    } else {
      alert('Please enter a valid OpenAI API key.');
    }
  });

  // Listen for AI suggestions from the background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'AI_SUGGESTIONS') {
      suggestionsDiv.style.display = 'block';
      suggestionsDiv.textContent = message.suggestions;
    }
  });

  // Request AI analysis when the popup is opened
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js']
    });
  });
});
