// components/TabbyOnSiteMessaging.js
import React from 'react'
import Script from 'next/script'

const TabbyOnSiteMessaging = ({ price }) => {
  const tabbyPublicKey = process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY;

  console.log(tabbyPublicKey);

  return (
    <>
      {/* 
        1. Set up the global _tabbyPromo config *before* loading the snippet
        2. Load the "promo.js" script asynchronously 
      */}
      <Script id="tabby-promo-config" strategy="beforeInteractive">
        {`
          window._tabbyPromo = {
            key: '${tabbyPublicKey}',
            lang: 'ar',
            priceSelector: '[data-price]',
            priceValue: function(element) {
              if (element.hasAttribute('data-price')) {
                return parseFloat(element.getAttribute('data-price'));
              }
              return 0;
            },
            parentSelector: 'body',
            loaders: [
              function() {
                var snippet = document.createElement('script');
                snippet.src = "https://static.tabby.ai/promo.js";
                snippet.async = true;
                document.body.appendChild(snippet);
              }
            ]
          };
        `}
      </Script>

      {/* data-price tells Tabby how much to display in the “pay in 4” message */}
      <div data-price={price} style={{ margin: '1rem 0' }}>
        
        <p>السعر: {price} ريال</p>
      </div>
    </>
  );
}

export default TabbyOnSiteMessaging
