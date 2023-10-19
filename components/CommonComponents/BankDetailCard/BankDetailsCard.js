import styles from './BankDetailsCard.module.scss'
import Logo from '../Logo'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { toast } from 'react-toastify'
import { toastSuccessMessage } from '../../../constants/ar'


export default function BankDetailsCard(props) {
    const bank = props.bank
    const index = props.index


    function handleCopyText(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                toast.success(toastSuccessMessage.copiedMsg, { rtl: true, });
            })
            .catch((error) => {
                console.error(`Failed to copy ${text} to clipboard: ${error}`);
            });
    }

    return (
        <div className={`${styles.cardWrapper} ${(index == 0 ? styles.cardWrapper1 : index == 1 ? styles.cardWrapper2 : styles.cardWrapper3)}`}>
            <div className={`${styles.cardHeaderBox}`}>
                <Logo height={32} width={103} logoName={`${bank.bankLogo}`} alt={'Bank Logo'} />
            </div>
            <div className={styles.bankDetailsBox}>
                <div className={styles.bankDetailsSubBox}>
                    <p className={`fontMedium ${styles.bankDetailsHeader}`}> رقم الحساب {bank.accountNumber}</p>
                    <div className={styles.copyIconDiv} onClick={() => handleCopyText(bank.accountNumber)}>
                        <AllIconsComponenet height={21} width={24} iconName={'copy'} color={'#000000'} />
                    </div>
                </div>
                <div className={styles.bankDetailsSubBox}>
                    <p className={`fontMedium ${styles.bankDetailsHeader}`}>رقم الايبان {bank.IBANnumber}</p>
                    <div className={styles.copyIconDiv} onClick={() => handleCopyText(bank.IBANnumber)}>
                        <AllIconsComponenet height={21} width={24} iconName={'copy'} color={'#000000'} />
                    </div>
                </div>
            </div>
        </div>
    )
}
