import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollReset() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    const resetScroll = () => {
      // Force scroll to top with multiple approaches
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Try with auto behavior to override any smooth scrolling
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    };
    
    // Reset scroll immediately
    resetScroll();
    
    // Also try with a slight delay to ensure it happens after rendering
    const timer = setTimeout(resetScroll, 100);
    
    // Try one more time with a longer delay as a fallback
    const secondTimer = setTimeout(resetScroll, 300);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(secondTimer);
    };
  }, [pathname]);
}
