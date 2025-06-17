import { useRouter } from 'next/router'

// Component for a simple payment confirmation button
const PaymentConfirmButton = () => {
    const router = useRouter();

    const handleConfirmPayment = () => {
        router.push({
            pathname: '/payment',
            query: {
                orderId: res.data.id,
                freePayment: true
            }
        });
    };

    return (
        <div className="mt-4 text-left">
            <button
                onClick={handleConfirmPayment}
                className="
            bg-blue-600 
            hover:bg-blue-700 
            text-white 
            px-6 
            py-2 
            rounded-md 
            text-base 
            cursor-pointer 
          "
            >
                إتمام العملية
            </button>
        </div>
    );
};

export default PaymentConfirmButton;