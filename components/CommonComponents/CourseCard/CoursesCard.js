import styles from './CoursesCard.module.scss'
import Link from 'next/link';
import CoverImg from '../CoverImg';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { mediaUrl, subscriptionDays } from '../../../constants/DataManupulation';
import { dateWithDay, timeDuration } from '../../../constants/DateConverter';
import ContentAccessModal from '../ContentAccessModal/ContentAccessModal';
import { Dropdown, Space } from 'antd';
import { WhatsApp_Link } from '../../../constants/LinkConst';

export default function CoursesCard(props) {
	const courseDetails = props?.data?.course
	const [subscriptionDaysLeft, setSubscriptionDaysLeft] = useState()
	const contentAccess = props?.data?.availability?.contentAccess
	const [isModelForcontentAccess, setIsModelforcontentAccess] = useState(false)
	const coverImgUrl = courseDetails.pictureKey ? `${mediaUrl(courseDetails.pictureBucket, courseDetails.pictureKey)}` : '/images/previewImage.png'
	const daysLeft = props?.data?.daysLeft

	const date = props?.data?.availability
	useEffect(() => {
		const date = new Date(props?.data?.createdAt);
		date.setMonth(date.getMonth() + 6);
		const toady = new Date();
		const diffTime = Math.abs(date - toady);
		const remainingDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
		setSubscriptionDaysLeft(remainingDays)
	}, [props])

	const handleClick = () => {
		if (courseDetails.type != "on-demand" && contentAccess == false) {
			setIsModelforcontentAccess(true)
			return
		} else {
			Router.push(`/myCourse?courseId=${courseDetails.id}`)
		}
	}

	const items = [
		{
			label: <Link href={WhatsApp_Link} target='_blank'> طلب استرجاع مبلغ الدورة</Link>,
			key: '1',
		}
	];

	return (
		<>
			<div className={styles.cardMainDiv}>
				<div className='cursor-pointer' onClick={() => handleClick()}>
					<CoverImg height={201} url={coverImgUrl} />
				</div>
				<div className={styles.cardContentDiv}>
					<div className={styles.DropMenuBtnBox}>
						<h1 className={`fontBold ${styles.courseTitle}`}>{courseDetails.name}</h1>
						<Dropdown
							overlayClassName='dropDownMenu'
							menu={{
								items,
							}}
							renderTitle={() => ''}
							trigger={['click']}
						>
							<div className='cursor-pointer' style={{ height: '20px' }} onClick={(e) => e.preventDefault()}>
								<AllIconsComponenet height={20} width={20} iconName={'dropMenuIcon'} color={'#000000'} />
							</div>
						</Dropdown>
					</div>
					<div className={styles.subscriptionText}>
						<AllIconsComponenet height={20} width={20} iconName={'calenderDoubleColorIcon'} color={'#000000'} />
						<p className='px-2 text-sm'>{subscriptionDays(props.data)}</p>
					</div>

					{courseDetails.type == "on-demand" ?
						<>
							<button className={`${styles.followUpBtn} primaryStrockedBtn`} onClick={() => handleClick()}>متابعة الدروس</button>
						</>
						:
						<>
							{/* <div className={styles.subscriptionText}>
								<AllIconsComponenet height={14} width={14} iconName={'clock'} color={'#000000'} />
								<p className='px-2'>{timeDuration(date.timeFrom, date.timeTo)}</p>
							</div>
							<div className={styles.subscriptionText}>
								{courseDetails.type == "physical" ?
									<AllIconsComponenet height={14} width={14} iconName={'location'} color={'#000000'} />
									:
									<AllIconsComponenet height={14} width={14} iconName={'live'} color={'#000000'} />
								}
								{courseDetails.type == "physical" ? <Link href="/" className='link px-2'>{date?.locationName}</Link> : <p className='px-2'>{date?.locationName}</p>}
							</div> */}
							{/* <button className={`${styles.followUpBtn} primaryStrockedBtn`} onClick={() => Router.push(`myCourse/${courseDetails.id}`)}>متابعة الدورة المسجلة</button> */}
							<button className={`${styles.followUpBtn} primaryStrockedBtn`} onClick={() => handleClick()}>متابعة محتوى الدورة المسجلة</button>
						</>
					}
				</div>
				{isModelForcontentAccess &&
					<ContentAccessModal
						isModelForcontentAccess={isModelForcontentAccess}
						setIsModelforcontentAccess={setIsModelforcontentAccess}
					/>
				}
			</div>
		</>
	)
}
