import { useRouter } from 'next/router'

// Component for a simple payment confirmation button
const PaymentConfirmButton = () => {
    const router = useRouter();
    
    const buttonStyles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    };

    const buttonElementStyles = {
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        backgroundColor: '#00a862',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    };

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
        <div style={buttonStyles}>
            <button
                style={buttonElementStyles}
                onClick={handleConfirmPayment}
            >
                تأكيد الدفع
            </button>
        </div>
    );
};

export default PaymentConfirmButton;