import { useEffect, useState } from 'react'
import UserInfoForm from "../../../../components/PaymentPageComponents/UserInfoForm/UserInfoForm";
import PaymentInfoForm from "../../../../components/PaymentPageComponents/PaymentInfoForm/PaymentInfoForm";
import axios from 'axios';
import { postAuthRouteAPI } from '../../../../services/apisService'
import { useDispatch, useSelector } from 'react-redux';
import { getNewToken } from '../../../../services/fireBaseAuthService';
import Spinner from '../../../../components/CommonComponents/spinner';
import * as fbq from '../../../../lib/fpixel'
import { inputErrorMessages } from '../../../../constants/ar';
import WhatsAppLinkComponent from '../../../../components/CommonComponents/WhatsAppLink';
import { getAuthRouteAPI } from '../../../../services/apisService';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export async function getServerSideProps({ req, res, resolvedUrl }) {

	const courseName = resolvedUrl.split('/')[2].replace(/-/g, ' ')
	const courseDetails = await axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=courseByNameNoAuth&name=${courseName}`).then((response) => (response.data)).catch((error) => error);

	if (((courseDetails == null) || (courseDetails?.length == 0))) {
		return {
			notFound: true,
		}
	}

	if (courseDetails?.isPurchasable == false) {
		return {
			notFound: true,
		}
	}

	if (courseDetails.type === 'physical') {
		const requests = [];
		const maleDatesReq = axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=AvailabilityByCourseIdNoAuth&courseId=${courseDetails?.id}&gender=male`);
		const femaleDatesReq = axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=AvailabilityByCourseIdNoAuth&courseId=${courseDetails?.id}&gender=female`);
		requests.push(maleDatesReq, femaleDatesReq);
		const [maleDates, femaleDates] = await Promise.all(requests);
		return {
			props: {
				courseDetails: courseDetails || null,
				maleDates: maleDates?.data || [],
				femaleDates: femaleDates?.data || [],
			}
		}
	} else if (courseDetails.type === 'online') {
		const mixDatesReq = await axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=AvailabilityByCourseIdNoAuth&courseId=${courseDetails?.id}&gender=mix`).then((response) => {
			return response
		}).catch((error) => {
			console.log("online course get availability error", error);
			return {
				notFound: true,
			}
		});
		return {
			props: {
				courseDetails: courseDetails,
				mixDates: mixDatesReq?.data || [],
			}
		}
	} else if (courseDetails?.type == 'on-demand') {
		const courseCurriculumReq = await axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=getCourseCurriculumNoAuth&courseId=${courseDetails?.id}`)
			.then((response) => (response.data))
			.catch((error) => {
				console.log("on-demand course get curriculum error", error);

				return {
					notFound: true,
				}
			});

		return {
			props: {
				courseDetails: courseDetails,
				courseCurriculum: courseCurriculumReq
			}
		}
	}
}

export default function Index(props) {

	console.log(props);
	const courseDetails = props?.courseDetails
	console.log(courseDetails);
	const currentType = courseDetails?.type;
	const maleDates = props?.courseDetails?.type == 'physical' ? props?.maleDates?.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)) : [];
	const femaleDates = props?.courseDetails?.type == 'physical' ? props?.femaleDates?.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)) : [];
	const mixDates = props?.courseDetails?.type == 'online' ? props?.mixDates?.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)) : [];
	const [loading, setLoading] = useState(false)

	const [changePage, setChangePage] = useState(false)
	const [studentsData, setStudentsData] = useState([])
	const [createdOrder, setCreatedOrder] = useState()
	const [checkoutId, setCheckoutId] = useState('')
	const [userAgreeError, setUserAgreeError] = useState()

	const storeData = useSelector((state) => state?.globalStore);
	const dispatch = useDispatch();

	const router = useRouter();
	const { asPath } = useRouter();

	const isUserLogin = localStorage.getItem('accessToken') ? true : false;

	// Check if there's data in localStorage on load and populate the state
	useEffect(() => {

		console.log("flag: ", JSON.parse(localStorage.getItem('isFromUserForm')));

		if (JSON.parse(localStorage.getItem('isBackToUserForm'))) {
			console.log('User navigated from login or register page.');

			if (localStorage.getItem('studentsData') && localStorage.getItem('courseType') && localStorage.getItem('userAgree')) {
				console.log("There are some local storage data");

				const savedStudentsData = JSON.parse(localStorage.getItem('studentsData'));
				const savedCourseType = JSON.parse(localStorage.getItem('courseType'));
				const savedUserAgree = JSON.parse(localStorage.getItem('userAgree'));


				changePageFunction(savedStudentsData, savedCourseType, savedUserAgree);

				// Remove saved data from localStorage
				localStorage.removeItem('studentsData');
				localStorage.removeItem('courseType');
				localStorage.removeItem('userAgree');
				localStorage.removeItem('isFromUserForm');
				localStorage.removeItem('isBackToUserForm');
			} else {
				console.log("There are no local storage data");
			}
		} else {
			// Remove saved data from localStorage
			localStorage.removeItem('studentsData');
			localStorage.removeItem('courseType');
			localStorage.removeItem('userAgree');
			localStorage.removeItem('isFromUserForm');
			localStorage.removeItem('isBackToUserForm');
			console.log('User navigated from another page.');
		}

	}, []);

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [changePage])

	useEffect(() => {
		const createOrder = async () => {
			if (courseDetails.type == "on-demand") {
				setLoading(true)
				fbq.event('Create Order', { courseId: courseDetails.id })
				let orderData = {
					routeName: 'createOrder',
					courseId: courseDetails.id,
					people: [
						{
							availabilityId: null,
							email: storeData?.viewProfileData?.email,
							fullName: storeData?.viewProfileData?.fullName,
							gender: storeData?.viewProfileData?.gender,
							phoneNumber: storeData?.viewProfileData?.phone || '',
						}
					]
				}
				await postAuthRouteAPI(orderData).then(res => {
					setCreatedOrder(res.data)
					setChangePage(true)
					setLoading(false)
					// generateCheckoutId(res.data.id)
				}).catch(async (error) => {
					console.log(error)
					if (error?.response?.status == 401) {
						await getNewToken().then(async (token) => {
							await postAuthRouteAPI(orderData).then(res => {
								setCreatedOrder(res.data)
								setChangePage(true)
								setLoading(false)

								// generateCheckoutId(res.data.id)
							})
						}).catch(error => {
							console.error("Error:", error);
						});
						setLoading(false)
					}
				})
			}
		}
		createOrder()
	}, [courseDetails, storeData.viewProfileData])

	const validation = (studentsData, courseType, userAgree) => {
		const data = [...studentsData]
		const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		let isError = false
		for (let i = 0; i < data?.length; i++) {
			if (data[i]?.gender == "") {
				data[i].genderCheck = inputErrorMessages.genderNotSelectErrorMsg
				isError = true
			}
			else {
				data[i].genderCheck = ""
			}

			if (data[i]?.date == "" && courseType != "on-demand") {
				data[i].dateCheck = inputErrorMessages.appropriateDateErrorMsg
				isError = true
			}
			else {
				data[i].dateCheck = ""
			}

			if (data[i]?.fullName == "" || !data[i]?.fullName) {
				data[i].nameCheck = inputErrorMessages.fullNameErrorMsgForRegister
				data[i].validName = ""
				isError = true
			} else if (data[i]?.fullName?.length < 3) {
				data[i].nameCheck = ""
				data[i].nameLengthCheck = inputErrorMessages.nameFormatErrorMsg
				data[i].validName = ""
				isError = true
			}
			else if ((data[i]?.fullName.split(" ")?.length - 1) < 1) {
				data[i].nameCheck = ""
				data[i].nameLengthCheck = ""
				data[i].validName = inputErrorMessages.nameThreeFoldErrorMsg
				isError = true
			}
			else {
				data[i].nameCheck = ""
				data[i].nameLengthCheck = ""
				data[i].validName = ""
			}

			if (data[i]?.phoneNumber == "") {
				data[i].phoneNoCheck = inputErrorMessages.mobileRequiredErrorMsg
				data[i].phoneNoLengthCheck = ""
				data[i].validPhoneNumber = ""
				isError = true
			}
			else if (!data[i]?.phoneNumber?.startsWith("05")) {
				data[i].phoneNoCheck = ""
				data[i].phoneNoLengthCheck = inputErrorMessages.mobileNumberFormatErrorMsg
				data[i].validPhoneNumber = ""
				isError = true
			}
			else if (data[i]?.phoneNumber?.length < 10) {
				data[i].phoneNoCheck = ""
				data[i].phoneNoLengthCheck = inputErrorMessages.phoneNumberLengthMsg
				data[i].validPhoneNumber = ""
				isError = true
			}
			else {
				data[i].phoneNoCheck = ""
				data[i].phoneNoLengthCheck = ""
				data[i].validPhoneNumber = ""
			}

			if (data[i]?.email == "") {
				data[i].emailCheck = inputErrorMessages.noEmailErrorMsg
				isError = true
			}
			else if (!(regexEmail.test(data[i]?.email))) {
				data[i].emailCheck = ""
				data[i].emailValidCheck = inputErrorMessages.enterEmailCorrectInputErrorMsg
			}
			else {
				data[i].emailCheck = ""
				data[i].emailValidCheck = ""
			}
		}
		setStudentsData(data);
		setUserAgreeError(userAgree)
		return isError
	}

	// const generateCheckoutId = async (orderId) => {
	// 	fbq.event('Initiate checkout', { courseId: courseDetails.id, paymentMode: 'mada' })
	// 	let data = {
	// 		orderId: orderId,
	// 		withcoupon: false,
	// 		couponId: null,
	// 		type: 'mada'
	// 	}
	// 	await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/testPaymentGateway`, data).then(res => {
	// 		if (res.status != 200) { return }
	// 		setCheckoutId(res.data[0].id)
	// 		setChangePage(true)
	// 		setLoading(false)
	// 	}).catch(error => {
	// 		console.log(error)
	// 	});
	// }

	const changePageFunction = async (studentsData, courseType, userAgree) => {
		let isError = validation(studentsData, courseType, userAgree)
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
				routeName: 'createOrder',
				courseId: courseDetails.id,
				people: createOrderData
			}

			// const params = {
			// 	orderData,
			// }

			// Save data to localStorage before making the API call
			localStorage.setItem('studentsData', JSON.stringify(studentsData));
			localStorage.setItem('courseType', JSON.stringify(courseType));
			localStorage.setItem('userAgree', JSON.stringify(userAgree));

			await postAuthRouteAPI(orderData).then(res => {
				let registeredDate;
				if (studentsData[0].gender === "male") {
					if (maleDates.length) {
						registeredDate = maleDates.find((date) => date.id === studentsData[0].availabilityId);
					} else {
						registeredDate = mixDates.find((date) => date.id === studentsData[0].availabilityId);
					}
				}
				else {
					if (femaleDates.length) {
						registeredDate = femaleDates.find((date) => date.id === studentsData[0].availabilityId);
					} else {
						registeredDate = mixDates.find((date) => date.id === studentsData[0].availabilityId);
					}
				}

				console.log(registeredDate);

				let courseType = currentType;

				localStorage.setItem('registeredDate', JSON.stringify(registeredDate));
				localStorage.setItem('courseType', JSON.stringify(courseType));
				localStorage.setItem('gender', JSON.stringify(studentsData[0].gender));
				console.log("registeredDate: ", JSON.parse(localStorage.getItem('registeredDate')));
				setCreatedOrder(res.data)
				setChangePage(true)
				setLoading(false)
				// generateCheckoutId(res.data.id)
			}).catch(async (error) => {
				console.log(error)
				if (error?.response?.status == 401) {

					dispatch({
						type: 'SET_RETURN_URL',
						returnUrl: window.location.pathname,
					});
					localStorage.setItem('isFromUserForm', true);
					await getNewToken().then(async (token) => {
						await postAuthRouteAPI(orderData).then(res => {
							let registeredDate;

							if (studentsData[0].gender === "male") {
								if (maleDates.length) {
									registeredDate = maleDates.find((date) => date.id === studentsData[0].availabilityId);
								} else {
									registeredDate = mixDates.find((date) => date.id === studentsData[0].availabilityId);
								}
							}
							else {
								if (femaleDates.length) {
									registeredDate = femaleDates.find((date) => date.id === studentsData[0].availabilityId);
								} else {
									registeredDate = mixDates.find((date) => date.id === studentsData[0].availabilityId);
								}
							}

							console.log(registeredDate);

							localStorage.setItem('registeredDate', JSON.stringify(registeredDate));
							console.log("registeredDate: ", JSON.parse(localStorage.getItem('registeredDate')));
							setCreatedOrder(res.data)
							setChangePage(true)
							setLoading(false)
							// generateCheckoutId(res.data.id)
						})
					}).catch(error => {
						console.error("Error:", error);
					});
				}
				toast.error("يجب عليك إنشاء حساب أولا", { rtl: true, })
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
						<PaymentInfoForm
							backToUserForm={backToUserForm}
							createdOrder={createdOrder}
							studentsData={studentsData}
							checkoutId={checkoutId}
						/>
					) : (
						<UserInfoForm
							isInfoFill={changePageFunction}
							studentsData={studentsData}
							courseDetails={courseDetails}
							maleDates={maleDates}
							femaleDates={femaleDates}
							mixDates={mixDates}
							userAgreeError={userAgreeError}
						/>
					)}
				</>
			}
			<WhatsAppLinkComponent paymentInfoChangePage={changePage} />
		</>
	)
}