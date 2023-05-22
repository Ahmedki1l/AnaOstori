import styles from './CompleteCourseIndicator.module.scss';

export default function ProgressCircle(props) {
	const strokeColor = props.color
	const size = props.size
	const percent = props.percent
	const showExtraDetails = props.showExtraDetails
	const strokeWidth = 10 * size / 100; // adjust as needed
	const radius = size / 2 - strokeWidth / 2;
	const circumference = 2 * Math.PI * radius;
 
	const progress = (percent / 100);
	const offset = circumference * (1 - progress);

	return (
		<>
			{percent &&
				<div className='relative'>
					<svg className={styles.progressCircle} width={size} height={size} stroke={strokeColor}>
						<circle
							className={styles.backgroundCircle}
							cx={size / 2}
							cy={size / 2}
							r={radius}
							strokeWidth={showExtraDetails ? `${strokeWidth/2}` : `${strokeWidth}`}
						/>
						<circle
							className={styles.foregroundCircle}
							cx={size / 2}
							cy={size / 2}
							r={radius}
							strokeWidth={strokeWidth}
							strokeDasharray={circumference}
							strokeDashoffset={offset}
						/>
					</svg>
					{showExtraDetails ?
						<>
							<p className={styles.progressBigText} style={{color:`${strokeColor}`}}>{Math.floor(percent)}%</p>
							<p className={styles.progressExtraText}>الإجمالي</p>
						</>
					:
						<>
							<p className={styles.progressText} style={{color:`${strokeColor}`}}>{Math.floor(percent)}%</p>
						</>
					}
				</div>
			}
		</>
	);
}