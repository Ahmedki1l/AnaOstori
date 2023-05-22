import React from 'react'
import styles from '../../styles/Home.module.scss'
import CoverImg from '../CommonComponents/CoverImg'
import * as LinkConst from '../../constants/LinkConst'


export default function CourseCard(props) {
	const coursePictureKey = props.coursePictureKey;
	const courseType = props.courseType
	const imgHeight = props.imgHeight

	const imageBaseUrl = LinkConst.File_Base_Url

	const  coverImgUrl = coursePictureKey ? `${imageBaseUrl}/${coursePictureKey}` : ""

  return (
	 <div  className={styles.courseCardWraper}>
		<CoverImg height={imgHeight} url={coverImgUrl}/>
		<div className={styles.courseDetailsBox}>
			<h1 className='head2 text-center'>{courseType}</h1>
		</div>
	</div>
  )
}