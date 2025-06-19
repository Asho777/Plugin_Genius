import { useCallback } from 'react';

/**
 * Hook to lock and unlock scroll position
 */
export const useScrollLock = () => {
  // Store original body style
  let originalStyle: string;
  
  // Lock scroll
  const lockScroll = useCallback(() => {
    // Save current scroll position
    const scrollY = window.scrollY;
    
    // Save original body style
    originalStyle = document.body.style.cssText;
    
    // Lock the body at current scroll position
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflowY = 'scroll';
  }, []);
  
  // Unlock scroll
  const unlockScroll = useCallback(() => {
    // Get the scroll position from body top property
    const scrollY = document.body.style.top ? 
      parseInt(document.body.style.top || '0', 10) * -1 : 
      0;
    
    // Restore original body style
    document.body.style.cssText = originalStyle;
    
    // Restore scroll position
    window.scrollTo(0, scrollY);
  }, []);
  
  return { lockScroll, unlockScroll };
};
