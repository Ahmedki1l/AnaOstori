import React from 'react'
import BankDetailsCard from '../components/CommonComponents/BankDetailCard/BankDetailsCard'
import * as PaymentConst from '../constants/PaymentConst'

export default function BankDetails() {
	const bankDetails = PaymentConst.bankDetails
	return (
		<div>
			<div className='bg-secondary'>
				<p className='head1 pb-4 pt-8 text-center text-white'>الحسابات البنكية</p>
				<p className='pt-4 pb-8 text-center text-white'>إذا حجزت لدورة وباقي ما دفعت لها، روح صفحة إستعلام الفواتير ومن هناك بترفع الايصال</p>
			</div>
			<div>
				<p className='text-center pt-8 pb-4'>المستفيد: شركة سنام لخدمات الأعمال</p>
				<div className='flex flex-wrap justify-center pt-4 pb-8'>
					{bankDetails.map((bank, index) => {
						return (
							<div key={`bank00${index}`} className='ml-2 py-4'>
								<BankDetailsCard bank={bank} index={index} />
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
