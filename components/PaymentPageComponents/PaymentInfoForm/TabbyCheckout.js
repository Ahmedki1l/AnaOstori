import React, { useState } from 'react'
import Script from 'next/script'

export default function TabbyCheckoutForm({
  amount = 100,
  redirectURL,
}) {
  const [isTabbyReady, setIsTabbyReady] = useState(false)
  const tabbyPublicKey = process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY

  const handleComplete = () => {
    if (redirectURL) {
      window.location.href = redirectURL
    } else {
      if (onError) {
        onError({ message: 'No redirect URL specified' })
      }
    }
  }

  return (
    <div className="w-full p-4"> 
      {/* Container for Tabby card, full width */}
      <div id="tabbyCard" className="w-full" />

      <Script
        src="https://checkout.tabby.ai/tabby-card.js"
        strategy="afterInteractive"
        onReady={() => {
          if (typeof window.TabbyCard !== 'undefined') {
            // Initialize Tabby card with 'wide' for a wider layout
            new window.TabbyCard({
              selector: '#tabbyCard',
              currency: 'SAR',
              lang: 'ar',
              price: String(amount),
              size: 'wide',    // or 'fullsize' if you want even larger
              theme: 'black',
              header: false
            })

            setIsTabbyReady(true);
          } else {
            console.error('TabbyCard is not defined. Check that the script loaded correctly.');
          }
        }}
        onError={(e) => {
          console.error('Failed to load tabby-card.js', e);
        }}
      />

      {/* Show the button ONLY after Tabby is initialized */}
      {isTabbyReady && (
        <div className="mt-4 text-left">
          <button
            onClick={handleComplete}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-base"
          >
            إتمام العملية
          </button>
        </div>
      )}
    </div>
  )
}
