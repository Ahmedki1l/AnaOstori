import React, { useEffect, useState } from 'react'
import styles from './CCItemVideoComponent.module.scss'
import ReactPlayer from 'react-player/lazy';


export default function CCItemVideoComponent(props) {
	const currentItemContent = props?.newSelectedCourseItem
	const videoUrl = currentItemContent?.url
	const itemId = currentItemContent?.id

	const itemCompleteHendler = () => {
		props.markItemCompleteHendler(itemId)
	}

	const playerConfig = {
		file: {
			attributes: {
				controlsList: 'nodownload', // hide download button
				disablePictureInPicture: true, // disable Picture-in-Picture mode
			},
		},
	};

	return (
		<div className={styles.itemWatchMainArea}>
			{videoUrl &&
				<ReactPlayer
					url={videoUrl}
					width='100%'
					height='100%'
					onEnded={() => itemCompleteHendler()}
					controls={true}
					config={playerConfig}
					onContextMenu={(e) => e.preventDefault()} // prevent right-click context menu
				/>
			}
		</div>
	)
}
