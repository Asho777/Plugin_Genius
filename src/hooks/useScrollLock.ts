import { useEffect } from 'react';

/**
 * Custom hook to temporarily lock scroll position during specific actions
 */
export const useScrollLock = () => {
  const lockScroll = () => {
    // Store current scroll position
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    // Create a style element to prevent scrolling
    const styleElement = document.createElement('style');
    styleElement.id = 'scroll-lock-style';
    styleElement.innerHTML = `
      body {
        overflow: hidden !important;
        position: fixed !important;
        width: 100% !important;
        top: -${scrollPosition}px !important;
        height: 100% !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Store the scroll position as a data attribute
    document.body.dataset.scrollPosition = scrollPosition.toString();
  };
  
  const unlockScroll = () => {
    // Remove the style element
    const styleElement = document.getElementById('scroll-lock-style');
    if (styleElement) {
      document.head.removeChild(styleElement);
    }
    
    // Restore scroll position
    const scrollPosition = parseInt(document.body.dataset.scrollPosition || '0', 10);
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('width');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('height');
    
    // Scroll to the stored position
    window.scrollTo(0, scrollPosition);
  };
  
  return { lockScroll, unlockScroll };
};
