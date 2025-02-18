import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import TabbyOnSiteMessaging from './TabbyOnSiteMessaging'
import Script from 'next/script'

const TabbyPaymentForm = ({ checkoutID, orderID, redirectURL, amount, couponAppliedData, onError }) => {

  const tabbyPublicKey = process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY;

  console.log("checkoutID: ", checkoutID);
  console.log("orderID: ", orderID);
  console.log("redirectURL: ", redirectURL);
  console.log("amount: ", amount);
  console.log("couponAppliedData: ", couponAppliedData);

  useEffect(() => {
    const tabbyPromo = document.createElement('script');
    tabbyPromo.innerHTML = `
      new TabbyPromo({
        selector: '#TabbyPromo',
        currency: 'SAR',
        price: '${amount}',
        lang: 'ar',
        source: 'product',
        publicKey: '${tabbyPublicKey}',
        merchantCode: 'anaastori'
     });`
    document.head.appendChild(tabbyPromo);

    return () => document.head.removeChild(tabbyPromo);
  }, [])

  return (
    <>
      <div id="tabby"></div>
      <script src="https://checkout.tabby.ai/tabby-promo.js"></script>
    </>
  )
}

export default TabbyPaymentForm
