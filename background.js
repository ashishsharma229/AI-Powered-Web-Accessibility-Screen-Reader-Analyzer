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

// For production use, truncate the data to avoid token overflow
const maxItems = 10; // Limiting the number of items to 10
const altTexts = message.altTexts.slice(0, maxItems);
const ariaLabels = message.ariaLabels.slice(0, maxItems);
const readingOrder = message.readingOrder.slice(0, maxItems);

const prompt = `
Analyze the following accessibility and screen reader information from a webpage. 
- Suggest improvements for alt texts and ARIA labels.
- Assess the reading order and roles to ensure that content is presented in a logical and accessible manner.
- Provide any specific recommendations to improve the screen reader experience.

Alt Texts: ${JSON.stringify(altTexts, null, 2)}
ARIA Labels: ${JSON.stringify(ariaLabels, null, 2)}
Reading Order and Roles: ${JSON.stringify(readingOrder, null, 2)}
`;


      // Retry logic with exponential backoff
      async function fetchWithRetry(url, options, retries = 2, delay = 1000) {
        try {
          const response = await fetch(url, options);
          if (!response.ok) {
            if (response.status === 429 && retries > 0) {
              console.warn(`Rate limit hit, retrying in ${delay}ms...`);
              await new Promise(resolve => setTimeout(resolve, delay));
              return fetchWithRetry(url, options, retries - 1, delay * 2); // Exponential backoff
            }
            console.error('Error fetching AI suggestions:', response.status, response.statusText);
            throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText}`);
          }
          return await response.json();
        } catch (error) {
          throw error;
        }
      } 

      try {
        const data = await fetchWithRetry('https://api.openai.com/v1/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo-instruct', // Specify the correct model
            prompt: prompt,
            max_tokens: 200, //calculateMaxToken(prompt), // Adjust if needed, depending on your prompt size // 75 words =~ 100 token
            temperature: 0.5, // Adding temperature for variation in responses
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
          })
        });

        const suggestions = data.choices[0].text.trim();

        // Send the suggestions to the popup
        chrome.runtime.sendMessage({ type: 'AI_SUGGESTIONS', suggestions });
      } catch (error) {
        console.error('Error fetching AI suggestions:', error);
        chrome.runtime.sendMessage({
          type: 'AI_SUGGESTIONS',
          suggestions: `Failed to get suggestions: ${error.message}. Please check your OpenAI API key or try again later.`
        });
      }
    });
  }
});
