# AI-Powered Web Accessibility & Screen Reader Analyzer

This Chrome extension analyzes web pages for accessibility issues, including compatibility with screen readers, using OpenAI's language models. It collects data on alt texts, ARIA labels, and reading order, then sends this data to OpenAI for analysis and improvement suggestions.

## Features

- **Alt Text Analysis**: Checks for missing or poorly written alt texts in images.
- **ARIA Labels Check**: Ensures interactive elements are properly labeled for screen readers.
- **Screen Reader Compatibility**: Simulates screen reader flow and provides improvements for content reading order.
- **AI-Powered Recommendations**: Leverages OpenAI's GPT models to offer contextual suggestions for improving accessibility.

## Installation

1. Clone or download the repository.
2. Navigate to `chrome://extensions/` in your Chrome browser.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the folder containing the extension files.
5. The extension is now installed.

## Usage

1. Navigate to any webpage you want to analyze.
2. Click on the extension icon in your Chrome toolbar.
3. Enter your OpenAI API key when prompted.
4. The extension will analyze the page and provide accessibility improvement suggestions based on AI recommendations.

<img src="./images/in-action.png" width="300"/>

## Files

- **manifest.json**: Defines the extension's permissions and metadata.
- **content.js**: Collects accessibility data (alt texts, ARIA labels, and reading order).
- **background.js**: Handles OpenAI API communication and processes AI-generated suggestions.
- **popup.html**: UI for entering the OpenAI API key and displaying results.
- **popup.js**: Manages user interaction and displays accessibility suggestions.

## OpenAI API Key

To use this extension, you must provide your OpenAI API key. You can obtain it by signing up on [OpenAI](https://beta.openai.com/signup/).

1. In the extension popup, enter your API key in the provided input field.
2. Click **Save API Key** to store it locally.

<img src="./images/api-key.png" width="300"/>

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contribution

Feel free to submit issues or pull requests to improve the functionality of the extension.
