/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

/**
<<<<<<< HEAD
 * Prevents baby jailing the user when he clicks an external link.
 */
export const captureExternalLinks = () => {
  // Click handler
  const listenerFn = e => {
    const tagName = String(e.target.tagName).toLowerCase();
    const href = String(e.target.href);
=======
 * Prevents baby jailing the user when they click an external link.
 */
export const captureExternalLinks = () => {
  // Subscribe to all document clicks
  document.addEventListener('click', e => {
    const tagName = String(e.target.tagName).toLowerCase();
    const hrefAttr = e.target.getAttribute('href') || '';
>>>>>>> 85c8c9edb631a2b37e013a8078d665f499e3af7b
    // Must be a link
    if (tagName !== 'a') {
      return;
    }
    // Leave BYOND links alone
<<<<<<< HEAD
    const isByondLink = href.charAt(0) === '?'
      || href.startsWith(location.origin)
      || href.startsWith('byond://');
=======
    const isByondLink = hrefAttr.charAt(0) === '?'
      || hrefAttr.startsWith('byond://');
>>>>>>> 85c8c9edb631a2b37e013a8078d665f499e3af7b
    if (isByondLink) {
      return;
    }
    // Prevent default action
    e.preventDefault();
<<<<<<< HEAD
=======
    // Normalize the URL
    let url = hrefAttr;
    if (url.toLowerCase().startsWith('www')) {
      url = 'https://' + url;
    }
>>>>>>> 85c8c9edb631a2b37e013a8078d665f499e3af7b
    // Open the link
    Byond.topic({
      tgui: 1,
      window_id: window.__windowId__,
      type: 'openLink',
<<<<<<< HEAD
      url: href,
    });
  };
  // Subscribe to all document clicks
  document.addEventListener('click', listenerFn);
=======
      url,
    });
  });
>>>>>>> 85c8c9edb631a2b37e013a8078d665f499e3af7b
};
