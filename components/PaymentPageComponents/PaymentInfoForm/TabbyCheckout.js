import React, { useState, useEffect } from 'react'
import Script from 'next/script'

const TabbyCheckoutForm = ({ checkoutID, orderID, redirectURL, amount, couponAppliedData, onError }) => {

  const tabbyPublicKey = process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY;

  return (
    <div>
      <div id="tabbyCard" />

      <Script
        src="https://checkout.tabby.ai/tabby-card.js"
        strategy="afterInteractive"
        /**
         * onReady is called after the script has loaded
         * AND executed, so globals like TabbyCard are ready.
         */
        onReady={() => {
          if (typeof window.TabbyCard !== 'undefined') {
            new window.TabbyCard({
              selector: '#tabbyCard',
              currency: 'SAR',
              lang: 'ar',
              price: String(amount),
              size: 'narrow',
              theme: 'black',
              header: false
            })
          } else {
            console.error('TabbyPromo is not defined. Check that the script loaded correctly.')
          }
        }}
      />
    </div>
  );
}

export default TabbyCheckoutForm
