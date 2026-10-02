import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './CCItemVideoComponent.module.scss'
import ReactPlayer from 'react-player/lazy';

// A browser with no H.265 decoder still demuxes the container and plays the AAC
// track, so an undecodable video track looks identical to a working player with a
// blank picture. Chrome/Edge ship no software HEVC fallback, so the only reliable
// signal is that the decoder never produces a single frame while audio advances.
const DECODE_GRACE_SECONDS = 3

const getDecodedFrameCount = (video) => {
	if (typeof video?.getVideoPlaybackQuality === 'function') {
		return video.getVideoPlaybackQuality().totalVideoFrames
	}
	if (typeof video?.webkitDecodedFrameCount === 'number') {
		return video.webkitDecodedFrameCount
	}
	return null // API unavailable — stay silent rather than accuse a working player
}

export default function CCItemVideoComponent(props) {
	const currentItemContent = props?.newSelectedCourseItem
	const videoUrl = currentItemContent?.url
	const itemId = currentItemContent?.id
	const itemName = currentItemContent?.name
	const onPlaybackUnsupported = props?.onPlaybackUnsupported

	const playerRef = useRef(null)
	const [videoTrackFailed, setVideoTrackFailed] = useState(false)

	// Every lesson deserves a fresh verdict.
	useEffect(() => { setVideoTrackFailed(false) }, [itemId])

	const itemCompleteHendler = () => {
		props.markItemCompleteHendler(itemId)
	}

	const reportUnplayable = useCallback((reason) => {
		setVideoTrackFailed(true)
		onPlaybackUnsupported?.({ itemId, itemName, reason })
	}, [itemId, itemName, onPlaybackUnsupported])

	const detectSilentDecodeFailure = useCallback(({ playedSeconds }) => {
		if (videoTrackFailed || playedSeconds < DECODE_GRACE_SECONDS) return
		// A backgrounded tab keeps the audio running while the browser legitimately
		// stops decoding frames, which is not a failure.
		if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return
		const video = playerRef.current?.getInternalPlayer()
		if (!video || video.paused || video.ended || video.readyState < 2) return
		if (getDecodedFrameCount(video) === 0) reportUnplayable('no-frames-decoded')
	}, [videoTrackFailed, reportUnplayable])

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
			{videoTrackFailed &&
				<div className={styles.unplayableNotice} dir='rtl'>
					<p className={`fontBold ${styles.unplayableTitle}`}>الصورة لا تظهر على هذا الجهاز</p>
					<p className={styles.unplayableBody}>
						الصوت يعمل، لكن هذا المقطع مسجّل بصيغة فيديو (H.265) لا يستطيع متصفح هذا الجهاز عرضها.
						المشكلة في إعدادات الجهاز وليست في الدرس نفسه.
					</p>
					<ul className={styles.unplayableHints}>
						<li>جرّب فتح الدرس من جهاز آخر أو من الجوال.</li>
						<li>على ويندوز: ثبّت HEVC Video Extensions من متجر مايكروسوفت.</li>
						<li>إذا استمرت المشكلة تواصل معنا وسنوفّر لك نسخة بديلة من الدرس.</li>
					</ul>
				</div>
			}
			{videoUrl &&
				<ReactPlayer
					ref={playerRef}
					url={videoUrl}
					width='100%'
					height='100%'
					onEnded={() => itemCompleteHendler()}
					onProgress={detectSilentDecodeFailure}
					onError={() => reportUnplayable('player-error')}
					controls={true}
					config={playerConfig}
					onContextMenu={(e) => e.preventDefault()} // prevent right-click context menu
				/>
			}
		</div>
	)
}
