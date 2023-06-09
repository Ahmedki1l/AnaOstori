import React from 'react'
import { FormItem } from '../../antDesignCompo/FormItem'
import styles from './TestResults.module.scss'
import Select from '../../antDesignCompo/Select'
import ProgressBar from '../../CommonComponents/progressBar'

const TestResults = () => {
    return (
        <div className='maxWidthDefault px-4'>
            <div className='flex'>
                <FormItem
                    name={'selectperiod'}
                >
                    <Select
                        fontSize={16}
                        width={133}
                        height={40}
                        placeholder="اختر الفترة"
                    />
                </FormItem>
                <FormItem
                    name={'selectgender'}
                >
                    <Select
                        fontSize={16}
                        width={133}
                        height={40}
                        placeholder="اختر الجنس "
                    />
                </FormItem>
            </div>
            <div>
                <table className={styles.tableArea}>
                    <thead className={styles.tableHeaderArea}>
                        <tr >
                            <th className={styles.tableHead1}>الطالب</th>
                            <th className={styles.tableHead2}>معلومات التواصل</th>
                            <th className={styles.tableHead3}>مستوى التقدم</th>
                            <th className={styles.tableHead4}>نتائج الاختبارات</th>
                            <th className={styles.tableHead5}>تاريخ الاشتراك</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBodyArea}>
                        <tr className={styles.tableRow}>
                            <td>عبدالإله مدخلي</td>
                            <td>0563974497 hisham@gmail.com</td>
                            <td>
                                <div className={styles.progressbar}>
                                    <ProgressBar percentage={50} bgColor={'#2BB741'} height={14} />
                                </div>
                            </td>
                            <td>مشاهدة الدرجات</td>
                            <td>5 فبراير 2023</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TestResults