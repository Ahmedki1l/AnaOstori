import React, { useState, useEffect } from 'react'

const TabbyPaymentForm = ({ checkoutID, orderID, redirectURL, amount, couponAppliedData, onError }) => {

  const tabbyPublicKey = process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY;
  console.log("tabbyPublicKey", tabbyPublicKey);

  useEffect(() => {

    const tabbyForm = document.createElement('script');
    tabbyForm.src = `https://checkout.tabby.ai/tabby-promo.js`;
    tabbyForm.async = true;
    document.head.appendChild(tabbyForm);

    return () => document.head.removeChild(tabbyForm);

  }, [checkoutID]);

  useEffect(() => {
    const tabbyDesignScript = document.createElement('script');
    tabbyDesignScript.innerHTML = `
      new TabbyPromo({
        selector: '#TabbyPromo',
        currency: 'SAR',
        price: '${amount}',
        lang: 'ar',
        source: 'product',
        publicKey: '${tabbyPublicKey}',
        merchantCode: 'anaastori'
     });`

    document.head.appendChild(tabbyDesignScript);

    return () => document.head.removeChild(tabbyDesignScript);
  }, [])

  return (
    <>
      <div id="tabby"></div>
    </>
  )
}

export default TabbyPaymentForm
