import React from 'react'

export default function TamaraCheckoutForm({
  orderId,
  amount,
  couponAppliedData,
  tamaraUrl,
  onError
}) {

  const initiateTamaraPayment = () => {
    if (tamaraUrl) {
      // Redirect to Tamara checkout URL
      window.location.href = tamaraUrl
    } else {
      if (onError) {
        onError(new Error('No Tamara checkout URL available'))
      }
    }
  }

  return (
    <div className="w-full p-4">
      {/* Payment Button */}
      <button
        onClick={initiateTamaraPayment}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
      >
        ادفع مع تمارا
      </button>
      
      {/* Info Message */}
      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 text-center">
          سيتم توجيهك إلى صفحة الدفع الخاصة بتمارا لإتمام عملية الدفع
        </p>
      </div>
    </div>
  )
} 