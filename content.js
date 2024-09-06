(function() {
  // Collect all image alt texts on the page
  const allImages = document.querySelectorAll('img');
  const altTexts = Array.from(allImages).map(img => ({
    src: img.src,
    alt: img.alt || 'No alt text'
  }));

  // Collect ARIA attributes
  const ariaElements = document.querySelectorAll('[aria-label]');
  const ariaLabels = Array.from(ariaElements).map(el => ({
    tag: el.tagName.toLowerCase(),
    ariaLabel: el.getAttribute('aria-label')
  }));

  // Collect the reading order and roles
  const readingOrder = Array.from(document.body.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button, img, [role]')).map(el => {
    return {
      tag: el.tagName.toLowerCase(),
      content: el.innerText || (el.alt ? `Image with alt text: ${el.alt}` : el.src || 'No content'),
      role: el.getAttribute('role') || 'No role',
      ariaLabel: el.getAttribute('aria-label') || 'No aria-label'
    };
  });

  // Send the collected data to the background script
  chrome.runtime.sendMessage({
    type: 'COLLECTED_DATA',
    altTexts,
    ariaLabels,
    readingOrder
  });

})();