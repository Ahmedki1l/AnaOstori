import React, { useState, useEffect } from 'react'
import Script from 'next/script'

const TabbyPaymentForm = ({ amount }) => {

  const tabbyPublicKey = process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY;

  return (
    <div>
      {/* The container where Tabby will place its widget */}
      <div id="TabbyPromo" style={{ margin: '1rem 0' }} />

      {/* 1) Load the Tabby promo script AFTER the page is interactive */}
      <Script
        src="https://checkout.tabby.ai/tabby-promo.js"
        strategy="afterInteractive"
      />

      {/* 2) Once the script is loaded, initialize TabbyPromo */}
      <Script id="tabby-promo-init" strategy="afterInteractive">
        {`
        // Make sure TabbyPromo is available, then initialize it
        if (typeof TabbyPromo !== 'undefined') {
          new TabbyPromo({
            selector: '#TabbyPromo',
            currency: 'SAR',
            price: '${amount}',   // If Tabby expects a numeric string
            lang: 'ar',          // or 'en'
            source: 'product',
            publicKey: '${tabbyPublicKey}',
            merchantCode: 'anaastori'
          });
        } else {
          console.error("TabbyPromo is not defined. Check that the script loaded correctly.");
        }
      `}
      </Script>
    </div>
  );
}

export default TabbyPaymentForm
