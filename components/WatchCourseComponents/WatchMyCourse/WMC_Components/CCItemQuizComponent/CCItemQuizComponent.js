import Link from 'next/link'
import React from 'react'
import Icon from '../../../../CommonComponents/Icon'
import styles from './CCItemQuizComponent.module.scss'
import useWindowSize from '../../../../../hooks/useWindoSize'

export default function CCItemQuizComponent(props) {
	const mediumScreen = useWindowSize().mediumScreen
	const currentItemContent = props?.newSelectedCourseItem
	const quizeStatus = currentItemContent.grade == null ? 'notAttempted' : currentItemContent.grade >= currentItemContent.numberOfQuestionsToPass ? 'pass' : 'fail'
	const quizIcon = quizeStatus == 'pass' ? 'quizPassIcon' : quizeStatus == 'fail' ? 'quizFailIcon' : 'quizNotAttemptIcon'
	const iconHeight = quizeStatus == 'pass' ? (mediumScreen ? '72' : '107') : quizeStatus == 'fail' ? (mediumScreen ? '70' : '105') : (mediumScreen ? '65' : '97')
	const quizText1 = quizeStatus == 'pass' ? 'مجتاز ' : quizeStatus == 'fail' ? 'تغلط بالتدريب احسن من انك تغلط بالاختبار الحقيقي ' : 'الاختبار موجود على مايكروسوفت فورم '
	const quizText2 = quizeStatus == 'pass' ? 'رسالة المعلم هنا ' : quizeStatus == 'fail' ? 'رسالة المعلم هنا ' : 'بعد ما تختبر، المعلم رح يرصد لك الدرجة هنا'
	const buttonText = quizeStatus == 'pass' ? 'إعادة الاختبار ' : quizeStatus == 'fail' ? 'إعادة الاختبار ' : 'انتقال إلى الاختبار'

	return (
		<div className={styles.quizContentWrapper}>
			<div className={styles.quizContentSubWrapper}>
				<Icon height={`${iconHeight}`} width={mediumScreen ? 72 : 107} iconName={`${quizIcon}`} alt={'Quiz Logo'} />
				<h1 className={`fontBold ${styles.quizText1}`}>{quizText1}</h1>
				<p className={`fontMedium ${styles.quizText2}`}>{quizText2}</p>
				<div className={styles.goQuizBtnBox}>
					<Link href={`${currentItemContent?.url}`} target='_blank' className='normalLinkText'>
						<button className='primaryStrockedBtn'>{buttonText}</button>
					</Link>
				</div>
			</div>
		</div>
	)
}
