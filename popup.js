// Filename: popup.js

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const apiKeyInputLabel = document.getElementById('apiKeyInputLabel');
  const saveApiKeyButton = document.getElementById('saveApiKey');
  const suggestionsDiv = document.getElementById('suggestions');

  // Check if the API key is already stored when popup opens
  chrome.storage.local.get(['openaiApiKey'], (result) => {
    if (result.openaiApiKey) {
      // API key exists, hide the input field and analyze the page
      apiKeyInput.style.display = 'none';
      apiKeyInputLabel.style.display = 'none';
      saveApiKeyButton.style.display = 'none';
      suggestionsDiv.style.display = 'block';
      analyzePage(result.openaiApiKey);
    } else {
      // API key doesn't exist, show the input field
      suggestionsDiv.style.display = 'none';
    }
  });

  // Save the API key when the user clicks "Save API Key"
  saveApiKeyButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.local.set({ openaiApiKey: apiKey }, () => {
        alert('API Key saved! Please reopen the extension.');
        apiKeyInput.style.display = 'none';
        apiKeyInputLabel.style.display = 'none';
        saveApiKeyButton.style.display = 'none';
        suggestionsDiv.style.display = 'block';
        analyzePage(apiKey);
      });
    } else {
      alert('Please enter a valid OpenAI API key.');
    }
  });

  // Function to analyze the page using the stored API key
  function analyzePage(apiKey) {
    suggestionsDiv.textContent = 'Analyzing page...';
    
    // Get the active tab and inject content script to analyze the page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      });
    });

    // Listen for AI suggestions from the background script
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'AI_SUGGESTIONS') {
        suggestionsDiv.style.display = 'block';
        suggestionsDiv.textContent = message.suggestions;
      }
    });
  }
});