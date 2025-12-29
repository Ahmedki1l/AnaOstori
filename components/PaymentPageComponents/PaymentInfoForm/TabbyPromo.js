import React, { useEffect, useRef } from 'react';

const TabbyPomoForm = ({ checkoutID, orderID, redirectURL, amount, couponAppliedData, onError }) => {
  const tabbyPublicKey = process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY;
  
  // Generate a unique container ID for this widget instance.
  // Using a stable ID that doesn't change on re-renders when amount is missing
  const widgetIdRef = useRef(`TabbyPromo_${Math.random().toString(36).substr(2, 9)}`);
  const containerRef = useRef(null);
  
  // Dynamically load the TabbyPromo script only once.
  const loadScript = () => {
    return new Promise((resolve, reject) => {
      if (document.getElementById('tabbyScript')) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.tabby.ai/tabby-promo.js';
      script.id = 'tabbyScript';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load TabbyPromo script'));
      document.body.appendChild(script);
    });
  };
  
  // Poll for window.TabbyPromo to become available.
  const waitForTabby = (maxAttempts = 10, interval = 100) => {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const check = () => {
        if (window.TabbyPromo !== undefined) {
          resolve();
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            reject(new Error('TabbyPromo not available after waiting'));
          } else {
            setTimeout(check, interval);
          }
        }
      };
      check();
    });
  };
  
  // Initialize the TabbyPromo widget in this container.
  const initializeWidget = () => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    new window.TabbyPromo({
      selector: `#${widgetIdRef.current}`,
      currency: 'SAR',
      price: String(amount),
      lang: 'ar',
      source: 'product',
      publicKey: tabbyPublicKey,
      merchantCode: 'anaastori',
    });
  };
  
  useEffect(() => {
    // Guard: only run effect logic when amount is present
    if (!amount) return;
    
    let isMounted = true;
    console.log("🚀 ~ TabbyPomoForm ~ amount:", amount);
    loadScript()
      .then(() => waitForTabby())
      .then(() => {
        if (isMounted) {
          initializeWidget();
        }
      })
      .catch(err => {
        console.error(err);
      });
    return () => {
      isMounted = false;
    };
  }, [amount, tabbyPublicKey]);
  
  // Early return AFTER all hooks are declared
  if (!amount) {
    return null;
  }
  
  // Wrap the widget container in a fixed width div to preserve the spacing (77rem).
  return (
    <div>
      <div id={widgetIdRef.current} ref={containerRef} />
    </div>
  );
};

export default TabbyPomoForm;
