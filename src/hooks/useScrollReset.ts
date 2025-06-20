import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollReset() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Create a style element to temporarily disable smooth scrolling
    const styleElement = document.createElement('style');
    styleElement.id = 'disable-smooth-scroll-style';
    styleElement.innerHTML = `
      html, body {
        scroll-behavior: auto !important;
        overflow-anchor: none !important;
        scroll-padding-top: 0 !important;
        scroll-snap-type: none !important;
        overscroll-behavior: none !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Force scroll to top with multiple approaches
    const resetScroll = () => {
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
    const timer = setTimeout(resetScroll, 50);
    
    // Try one more time with a longer delay as a fallback
    const secondTimer = setTimeout(resetScroll, 150);
    
    // Final attempt with an even longer delay
    const thirdTimer = setTimeout(() => {
      resetScroll();
      
      // One more attempt after all rendering should be complete
      const finalTimer = setTimeout(() => {
        resetScroll();
        
        // Remove the temporary style after all scroll resets are done
        if (styleElement.parentNode) {
          document.head.removeChild(styleElement);
        }
      }, 200);
      
      return () => clearTimeout(finalTimer);
    }, 300);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(secondTimer);
      clearTimeout(thirdTimer);
      
      // Ensure style element is removed on cleanup
      if (styleElement.parentNode) {
        document.head.removeChild(styleElement);
      }
    };
  }, [pathname]);
}
