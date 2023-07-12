import React from 'react'
import styles from '../../styles/Home.module.scss'
import CoverImg from '../CommonComponents/CoverImg'


export default function CourseCard(props) {
	const courseType = props.courseType
	const imgHeight = props.imgHeight


	return (
		<div className={styles.courseCardWraper}>
			<CoverImg height={imgHeight} url={props.pictureUrl} />
			<div className={styles.courseDetailsBox}>
				<h1 className='head2 text-center'>{courseType}</h1>
			</div>
		</div>
	)
}