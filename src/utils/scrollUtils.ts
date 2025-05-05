/**
 * Smoothly scrolls to the element with the given ID
 * @param elementId - The ID of the element to scroll to (without the # prefix)
 */
export const scrollToElement = (elementId: string): void => {
  // Remove the # if it's included
  const id = elementId.startsWith('#') ? elementId.substring(1) : elementId;
  
  const element = document.getElementById(id);
  
  if (element) {
    // Scroll to the element with smooth behavior
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};
