import React, { useState } from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'
import ReviewCard from './ReviewCard/ReviewCard'

export default function ReviewComponent(props) {

  return (
	<div className={`w-100 relative cursor-grab`}>
		<ScrollContainer className='flex'>
			{props.homeReviews?.length > 0 && props.homeReviews.map((review,index)=>{
				return(
					<div key={`review${index}` }>
						<ReviewCard review={review}/>
					</div>
				)})
			}
		</ScrollContainer>
	</div>
  )
}
