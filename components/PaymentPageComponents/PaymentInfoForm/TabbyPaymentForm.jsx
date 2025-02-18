import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import TabbyOnSiteMessaging from './TabbyOnSiteMessaging'

const TabbyPaymentForm = ({ checkoutID, orderID, redirectURL, amount, couponAppliedData, onError }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const router = useRouter();

  console.log("checkoutID: ", checkoutID);
  console.log("orderID: ", orderID);
  console.log("redirectURL: ", redirectURL);
  console.log("amount: ", amount);
  console.log("couponAppliedData: ", couponAppliedData);
  console.log("onError: ", onError);

  // // Countdown effect: Decrements every second and redirects when it reaches 0.
  // useEffect(() => {
  //   let timer
  //   if (countdown !== null && countdown > 0) {
  //     timer = setTimeout(() => {
  //       setCountdown(prev => prev - 1)
  //     }, 1000)
  //   } else if (countdown === 0) {
  //     // Redirect to the provided URL when countdown reaches 0.
  //     if (redirectURL) {
  //       window.location.href = redirectURL
  //     } else {
  //       onError({ message: 'رابط إعادة التوجيه غير متوفر.' })
  //       setIsLoading(false)
  //     }
  //   }
  //   return () => clearTimeout(timer)
  // }, [countdown, redirectURL, onError])

  // const handlePayment = async () => {
  //   setIsLoading(true)
  //   try {
  //     // Once the session is created, start a 3-second countdown for redirection.
  //     if (redirectURL) {
  //       setCountdown(3)
  //     } else {
  //       onError({ message: 'رابط إعادة التوجيه غير متوفر يرجى المحاولة مرة أخرى.' })
  //       setIsLoading(false)
  //     }
  //   } catch (error) {
  //     onError({
  //       message: 'فشل في تهيئة الدفع عبر تابي. يرجى المحاولة مرة أخرى'
  //     })
  //     console.error('Tabby payment error:', error)
  //     setIsLoading(false)
  //   }
  // }

  return (
    <div className="tabby-payment-form">
      {/* <button 
        className="tabby-button" 
        onClick={handlePayment} 
        disabled={isLoading}
      >
        {isLoading
          ? countdown !== null
            ? `يتم تحويلك إلى تابي خلال ${countdown} ثانية...`
            : 'يتم تحويلك إلى تابي...'
          : 'ادفع عبر تابي'}
      </button>

      <style jsx>{`
        .tabby-button {
          background-color: #0070f3;
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .tabby-button:hover {
          background-color: #005bb5;
        }
        .tabby-button:disabled {
          background-color: #999;
          cursor: not-allowed;
        }
      `}</style> */}
      <TabbyOnSiteMessaging price={amount} />
    </div>
  )
}

export default TabbyPaymentForm
