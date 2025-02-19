import React, { useState, useEffect } from 'react'
import Script from 'next/script'

const TabbyPomoForm = ({ checkoutID, orderID, redirectURL, amount, couponAppliedData, onError }) => {

  const tabbyPublicKey = process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY;

  return (
    <div>
      <div id="TabbyPromo" />

      <Script
        src="https://checkout.tabby.ai/tabby-promo.js"
        strategy="afterInteractive"
        /**
         * onReady is called after the script has loaded
         * AND executed, so globals like TabbyPromo are ready.
         */
        onReady={() => {
          if (typeof window.TabbyPromo !== 'undefined') {
            new window.TabbyPromo({
              selector: '#TabbyPromo',
              currency: 'SAR',
              price: String(amount),
              lang: 'ar',
              source: 'product',
              publicKey: tabbyPublicKey,
              merchantCode: 'anaastori',
            })
          } else {
            console.error('TabbyPromo is not defined. Check that the script loaded correctly.')
          }
        }}
      />
    </div>
  );
}

export default TabbyPomoForm
