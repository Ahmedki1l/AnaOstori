import { useEffect, useState } from 'react'
import UserInfoForm from "../../../../components/PaymentPageComponents/UserInfoForm/UserInfoForm";
import PaymentInfoForm from "../../../../components/PaymentPageComponents/PaymentInfoForm/PaymentInfoForm";
import axios from 'axios';
import { createOrderAPI } from '../../../../services/apisService'
import { useDispatch, useSelector } from 'react-redux';
import { signOutUser } from '../../../../services/fireBaseAuthService';
import Spinner from '../../../../components/CommonComponents/spinner';
import * as fbq from '../../../../lib/fpixel'

export async function getServerSideProps({ req, res, resolvedUrl }) {
	const courseName = resolvedUrl.split('/')[2].replace(/-/g, ' ')
	const courseDetails = await axios.get(`${process.env.API_BASE_URL}/courseByNameWithoutAuth/${courseName}`)
		.then((response) => (response.data)).catch((error) => error);

	const maleDatesReq = axios.get(`${process.env.API_BASE_URL}/availibiltyByCourseId/${courseDetails.id}/male`)

	const femaleDatesReq = axios.get(`${process.env.API_BASE_URL}/availibiltyByCourseId/${courseDetails.id}/female`)

	const mixDatesReq = axios.get(`${process.env.API_BASE_URL}/availibiltyByCourseId/${courseDetails.id}/mix`)


	const [maleDates, femaleDates, mixDates] = await Promise.all([
		maleDatesReq,
		femaleDatesReq,
		mixDatesReq,
	])




	if (((courseDetails == null) || (courseDetails?.length == 0))) {
		return {
			notFound: true,
		}
	}

	return {
		props: {
			courseDetails: courseDetails,
			maleDates: maleDates.data,
			femaleDates: femaleDates.data,
			mixDates: mixDates.data,
		}
	}
}

export default function Index(props) {

	const courseDetails = props.courseDetails
	const maleDates = props.maleDates
	const femaleDates = props.femaleDates
	const mixDates = props.mixDates
	const [loading, setLoading] = useState(false)

	const [changePage, setChangePage] = useState(false)
	const [studentsData, setStudentsData] = useState([])
	const [createdOrder, setCreatedOrder] = useState()
	const [checkoutId, setCheckoutId] = useState('')

	const storeData = useSelector((state) => state?.globalStore);
	const dispatch = useDispatch();



	useEffect(() => {
		const createOrder = async () => {
			if (courseDetails.type == "on-demand") {
				setLoading(true)
				fbq.event('Create Order', { courseId: courseDetails.id })
				let orderData = {
					courseId: courseDetails.id,
					people: [
						{
							availabilityId: null,
							email: storeData?.viewProfileData?.email,
							fullName: storeData?.viewProfileData?.fullName,
							gender: storeData?.viewProfileData?.gender,
							phoneNumber: storeData?.viewProfileData?.phone,
						}
					]
				}
				const params = {
					orderData,
					accessToken: storeData?.accessToken
				}
				await createOrderAPI(params).then(res => {
					setCreatedOrder(res.data)
					generateCheckoutId(res.data.id)
				}).catch(error => {
					console.log(error)
					setLoading(false)
					if (error?.response?.status == 401) {
						signOutUser()
						dispatch({
							type: 'EMPTY_STORE'
						});
					}
				})
			}
		}
		createOrder()
	}, [courseDetails, storeData.viewProfileData, storeData.accessToken])

	const validation = (studentsData, courseType) => {
		const data = [...studentsData]
		const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		let isError = false

		for (let i = 0; i < data.length; i++) {
			if (data[i].gender == "") {
				data[i].genderCheck = "فضلا اختار الجنس"
				isError = true
			}
			else {
				data[i].genderCheck = ""
			}

			if (data[i].date == "" && courseType != "on-demand") {
				data[i].dateCheck = "فضلا اختار الموعد المناسب"
				isError = true
			}
			else {
				data[i].dateCheck = ""
			}

			if (data[i].fullName == "") {
				data[i].nameCheck = "فضلا ادخل الاسم الثلاثي"
				data[i].validName = ""
				isError = true
			}
			else if (data[i].fullName.length < 3) {
				data[i].nameCheck = ""
				data[i].nameLengthCheck = "يجب أن يتكون الاسم من ثلاث حروف او اكثر"
				data[i].validName = ""
				isError = true
			}
			else if ((data[i].fullName.split(" ").length - 1) < 1) {
				data[i].nameCheck = ""
				data[i].nameLengthCheck = ""
				data[i].validName = "يجب ان يكون الاسم ثلاثي مثال : عبدالإله مدخلي"
				isError = true
			}
			else {
				data[i].nameCheck = ""
				data[i].nameLengthCheck = ""
				data[i].validName = ""
			}

			if (data[i].phoneNumber == "") {
				data[i].phoneNoCheck = "فضلا ادخل رقم الجوال"
				data[i].phoneNoLengthCheck = ""
				data[i].validPhoneNumber = ""
				isError = true
			}
			else if (data[i].phoneNumber.length < 10) {
				data[i].phoneNoCheck = ""
				data[i].phoneNoLengthCheck = "يجب ان يتكون الجوال من ١٠ ارقام"
				data[i].validPhoneNumber = ""
				isError = true
			}
			else if (!data[i].phoneNumber.startsWith("05") && !data[i].phoneNumber.startsWith("00")) {
				data[i].phoneNoCheck = ""
				data[i].phoneNoLengthCheck = ""
				data[i].validPhoneNumber = "الصيغة المدخلة غير صحيحة، فضلا اكتب الرقم بصيغة 05"
				isError = true
			}
			else {
				data[i].phoneNoCheck = ""
				data[i].phoneNoLengthCheck = ""
				data[i].validPhoneNumber = ""
			}

			if (data[i].email == "") {
				data[i].emailCheck = "فضلا ادخل الايميل"
				isError = true
			}
			else if (!(regexEmail.test(data[i].email))) {
				data[i].emailCheck = ""
				data[i].emailValidCheck = "فضلا عيد كتابة ايميلك بالطريقة الصحيحة"
				isError = true
			}
			else {
				data[i].emailCheck = ""
				data[i].emailValidCheck = ""
			}
		}
		setStudentsData(data);
		return isError
	}

	const generateCheckoutId = async (orderId) => {
		fbq.event('Initiate checkout', { courseId: courseDetails.id, paymentMode: 'mada' })
		let data = {
			orderId: orderId,
			withcoupon: false,
			couponId: null,
			type: 'mada'
		}
		await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/testPaymentGateway`, data).then(res => {
			if (res.status != 200) { return }
			setCheckoutId(res.data[0].id)
			setChangePage(true)
			setLoading(false)
		}).catch(error => {
			console.log(error)
		});
	}

	const changePageFunction = async (studentsData, courseType) => {
		let isError = validation(studentsData, courseType)
		fbq.event('Create Order', { courseId: courseDetails.id })
		if (!isError) {
			let createOrderData = JSON.parse(JSON.stringify(studentsData))
			createOrderData.forEach((data) => {
				delete data.date;
				delete data.dateCheck;
				delete data.emailValidCheck;
				delete data.emailCheck;
				delete data.genderCheck;
				delete data.nameCheck;
				delete data.nameLengthCheck;
				delete data.validName;
				delete data.phoneNoCheck;
				delete data.phoneNoLengthCheck;
				delete data.validPhoneNumber;
				data.phoneNumber = data.phoneNumber.replace(/[0-9]/, "+966")
				if (courseType == 'on-demand') data.availabilityId = null
			})
			let orderData = {
				courseId: courseDetails.id,
				people: createOrderData
			}

			const params = {
				orderData,
				accessToken: storeData?.accessToken
			}

			await createOrderAPI(params).then(res => {
				setCreatedOrder(res.data)
				generateCheckoutId(res.data.id)
			}).catch(error => {
				console.log(error)
				if (error?.response?.status == 401) {
					signOutUser()
					dispatch({
						type: 'EMPTY_STORE'
					});
				}
			})
		}
		setStudentsData(studentsData)
	}

	const backToUserForm = (studentsData, data) => {
		setStudentsData(studentsData)
		setChangePage(data)
	}

	return (
		<>
			{loading ?
				<div className='flex justify-center items-center h-60'>
					<Spinner />
				</div>
				:
				<>
					{changePage ? (
						<PaymentInfoForm backToUserForm={backToUserForm} createdOrder={createdOrder} studentsData={studentsData} checkoutId={checkoutId} />
					) : (
						<UserInfoForm isInfoFill={changePageFunction} studentsData={studentsData} courseDetails={courseDetails} maleDates={maleDates} femaleDates={femaleDates} mixDates={mixDates} />
					)}
				</>
			}
		</>
	)
}