import { useEffect } from 'react';

/**
 * Hook to reset scroll position to top on component mount
 */
export const useScrollReset = () => {
  useEffect(() => {
    // Force scroll to top with multiple approaches
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    });
    
    // Add a class to body to disable smooth scrolling temporarily
    document.body.classList.add('disable-smooth-scroll');
    
    // Remove the class after a delay
    const timeout = setTimeout(() => {
      document.body.classList.remove('disable-smooth-scroll');
    }, 1000);
    
    return () => {
      clearTimeout(timeout);
      document.body.classList.remove('disable-smooth-scroll');
    };
  }, []);
};
