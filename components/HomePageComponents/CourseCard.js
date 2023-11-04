import React from 'react'
import styles from '../../styles/Home.module.scss'
import CoverImg from '../CommonComponents/CoverImg'


export default function CourseCard(props) {
	const courseType = props.courseType
	const imgHeight = props.imgHeight


	return (
		<>
			<CoverImg height={imgHeight} url={props.pictureUrl} />
			<div className={styles.courseDetailsBox}>
				<h1 className={` text-center ${styles.courseTypeText}`}>{courseType}</h1>
			</div>
		</>
	)
}