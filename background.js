// Filename: background.js

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'COLLECTED_DATA') {
    chrome.storage.local.get(['openaiApiKey'], async (result) => {
      const openaiApiKey = result.openaiApiKey;
      if (!openaiApiKey) {
        chrome.runtime.sendMessage({
          type: 'AI_SUGGESTIONS',
          suggestions: 'No OpenAI API key found. Please enter your API key in the extension popup.'
        });
        return;
      }

      const prompt = `
Analyze the following accessibility and screen reader information from a webpage. 
- Suggest improvements for alt texts and ARIA labels.
- Assess the reading order and roles to ensure that content is presented in a logical and accessible manner.
- Provide any specific recommendations to improve the screen reader experience.

Alt Texts: ${JSON.stringify(message.altTexts, null, 2)}
ARIA Labels: ${JSON.stringify(message.ariaLabels, null, 2)}
Reading Order and Roles: ${JSON.stringify(message.readingOrder, null, 2)}
`;

      try {
        const response = await fetch('https://api.openai.com/v1/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`
          },
          body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 500
          })
        });

        if (!response.ok) {
          throw new Error(`OpenAI API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        const suggestions = data.choices[0].text.trim();

        // Send the suggestions to the popup
        chrome.runtime.sendMessage({ type: 'AI_SUGGESTIONS', suggestions });
      } catch (error) {
        console.error('Error fetching AI suggestions:', error);
        chrome.runtime.sendMessage({
          type: 'AI_SUGGESTIONS',
          suggestions: 'Failed to get suggestions. Please try again later.'
        });
      }
    });
  }
});
