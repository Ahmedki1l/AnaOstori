import React from 'react'
import File from './customeIcons/file'
import PlayButton from './customeIcons/playButton'
import Quiz from './customeIcons/quiz'
import WhatsApp from './customeIcons/whatsApp'
import Calender from './customeIcons/calender'
import Persone1 from './customeIcons/persone1'
import Persone2 from './customeIcons/persone2'
import Mobile from './customeIcons/mobile'
import Email from './customeIcons/email'
import Lock from './customeIcons/lock'
import GoogleIcon from './customeIcons/googleIcon'
import Bell from './customeIcons/bell'
import Home from './customeIcons/home'
import History from './customeIcons/history'
import Setting from './customeIcons/setting'
import ArrowRight from './customeIcons/arrowRight'
import ArrowLeft from './customeIcons/arrowLeft'
import Key from './customeIcons/key'
import AccountDelet from './customeIcons/accountDelet'
import AccountRestore from './customeIcons/accountRestore'
import Phone from './customeIcons/phone'
import Male from './customeIcons/male'
import Female from './customeIcons/female'
import NoData from './customeIcons/noData'
import Copy from './customeIcons/copy'
import StudentOneIcon from './customeIcons/studentOneIcon'
import StudentTwoIcon from './customeIcons/studentTwoIcon'
import StudentThreeIcon from './customeIcons/studentThreeIcon'
import Clock from './customeIcons/clock'
import Location from './customeIcons/location'
import Live from './customeIcons/live'
import YoutubeIcon from './customeIcons/youtubeIcon'
import InstaIcon from './customeIcons/instaIcon'
import TwitterIcon from './customeIcons/twitterIcon'
import TiktokIcon from './customeIcons/tiktokIcon'
import WhatsAppFill from './customeIcons/whatsAppFill'
import ProfileIcon from './customeIcons/profileIcon'
import Logout from './customeIcons/logout'
import PhysicalCourseIcon from './customeIcons/physicalCourseIcon'
import OnlineCourseIcon from './customeIcons/onlineCourseIcon'
import Globe from './customeIcons/globe'
import Arrow from './customeIcons/arrow'
import Lock2 from './customeIcons/lock2'
import Plus from './customeIcons/plus'
import LibraryIcon from './customeIcons/libraryIcon'
import UploadFile from './customeIcons/uploadFile'
import DropDown from './customeIcons/dropDown'
import Star from './customeIcons/star'
import Graduate from './customeIcons/graduate'
import UpDownArrow from './customeIcons/UpDownArrow'
import DeleteCourse from './customeIcons/DeleteCourse'
import CloseIcon from './customeIcons/closeIcon'
import EditIcon from './customeIcons/editIcon'
import PersoneGroup from './customeIcons/personGroup'
import ProgressIcon from './customeIcons/progressIcon'
import Circle from './customeIcons/circle'
import PresentAtTime from './customeIcons/presentIcon'
import LateAtATime from './customeIcons/lateIcon'
import AbsentAtATime from './customeIcons/absentAtATime'
import ExcusedIcon from './customeIcons/excusedIcon'
import FullSeatsIcon from './customeIcons/fullSeatsIcon'
import FolderIcon from './customeIcons/folderIcon'
import CalenderStroked from './customeIcons/calenderStrocked'
import ClockStroked from './customeIcons/clockStroked'
import LocationStroked from './customeIcons/locationStroked'
import VisibilityIcon from './customeIcons/visibilityIcon'
import VisibilityOffIcon from './customeIcons/visibilityOffIcon'
import KeyBoardDownIcon from './customeIcons/keyBoardDownIcon'
import MenuIcon from './customeIcons/menuIcon'
import RightArrowIcon from './customeIcons/rightArrowIcon'
import CheckCircleRoundIcon from './customeIcons/checkCircleRoundIcon'
import DownloadIcon from './customeIcons/downloadIcon'
import RedBook from './customeIcons/redBook'
import GreenBook from './customeIcons/greenBook'
import AppleStore from './customeIcons/appleStore'



const AllIconsComponenet = ({ iconName, height, width, color = {}, strockColor = {} }) => {
	return (
		<>
			{iconName == 'file' && <File height={height} width={width} color={color} />}
			{iconName == 'quiz' && <Quiz height={height} width={width} color={color} />}
			{iconName == 'playButton' && <PlayButton height={height} width={width} color={color} />}
			{iconName == 'whatsapp' && <WhatsApp height={height} width={width} color={color} />}
			{iconName == 'whatsappFill' && <WhatsAppFill height={height} width={width} color={color} />}
			{iconName == 'calander' && <Calender height={height} width={width} color={color} />}
			{iconName == 'calenderStroked' && <CalenderStroked height={height} width={width} color={color} />}
			{iconName == 'clock' && <Clock height={height} width={width} color={color} />}
			{iconName == 'clockStroked' && <ClockStroked height={height} width={width} color={color} />}
			{iconName == 'persone1' && <Persone1 height={height} width={width} color={color} />}
			{iconName == 'persone2' && <Persone2 height={height} width={width} color={color} />}
			{iconName == 'mobile' && <Mobile height={height} width={width} color={color} />}
			{iconName == 'email' && <Email height={height} width={width} color={color} />}
			{iconName == 'lock' && <Lock height={height} width={width} color={color} />}
			{iconName == 'googleIcon' && <GoogleIcon height={height} width={width} color={color} />}
			{iconName == 'bell' && <Bell height={height} width={width} color={color} />}
			{iconName == 'home' && <Home height={height} width={width} color={color} />}
			{iconName == 'history' && <History height={height} width={width} color={color} />}
			{iconName == 'setting' && <Setting height={height} width={width} color={color} />}
			{iconName == 'arrowRight' && <ArrowRight height={height} width={width} color={color} />}
			{iconName == 'arrowLeft' && <ArrowLeft height={height} width={width} color={color} />}
			{iconName == 'key' && <Key height={height} width={width} color={color} />}
			{iconName == 'accountDelet' && <AccountDelet height={height} width={width} color={color} />}
			{iconName == 'accountRestore' && <AccountRestore height={height} width={width} color={color} />}
			{iconName == 'phone' && <Phone height={height} width={width} color={color} />}
			{iconName == 'male' && <Male height={height} width={width} color={color} />}
			{iconName == 'female' && <Female height={height} width={width} color={color} />}
			{iconName == 'noData' && <NoData height={height} width={width} color={color} />}
			{iconName == 'copy' && <Copy height={height} width={width} color={color} />}
			{iconName == 'location' && <Location height={height} width={width} color={color} />}
			{iconName == 'locationStroked' && <LocationStroked height={height} width={width} color={color} />}
			{iconName == 'live' && <Live height={height} width={width} color={color} />}
			{iconName == 'youtubeIcon' && <YoutubeIcon height={height} width={width} color={color} />}
			{iconName == 'instaIcon' && <InstaIcon height={height} width={width} color={color} />}
			{iconName == 'twitterIcon' && <TwitterIcon height={height} width={width} color={color} />}
			{iconName == 'tiktokIcon' && <TiktokIcon height={height} width={width} color={color} />}
			{iconName == 'profileIcon' && <ProfileIcon height={height} width={width} color={color} />}
			{iconName == 'logout' && <Logout height={height} width={width} color={color} />}
			{iconName == 'physicalCourseIcon' && <PhysicalCourseIcon height={height} width={width} color={color} />}
			{iconName == 'onlineCourseIcon' && <OnlineCourseIcon height={height} width={width} color={color} />}
			{iconName == 'globe' && <Globe height={height} width={width} color={color} />}
			{iconName == 'arrow' && <Arrow height={height} width={width} color={color} />}
			{iconName == 'lock2' && <Lock2 height={height} width={width} color={color} />}
			{iconName == 'plus' && <Plus height={height} width={width} color={color} />}
			{iconName == 'libraryIcon' && <LibraryIcon height={height} width={width} color={color} />}
			{iconName == 'uploadFile' && <UploadFile height={height} width={width} color={color} />}
			{iconName == 'dropDown' && <DropDown height={height} width={width} color={color} />}
			{iconName == 'star' && <Star height={height} width={width} color={color} />}
			{iconName == 'graduate' && <Graduate height={height} width={width} color={color} />}
			{iconName == 'updownarrow' && <UpDownArrow height={height} width={width} color={color} />}
			{iconName == 'deletecourse' && <DeleteCourse height={height} width={width} color={color} />}
			{iconName == 'closeicon' && <CloseIcon height={height} width={width} color={color} />}
			{iconName == 'editicon' && <EditIcon height={height} width={width} color={color} />}
			{iconName == 'personegroup' && <PersoneGroup height={height} width={width} color={color} />}
			{iconName == 'progressicon' && <ProgressIcon height={height} width={width} color={color} />}
			{iconName == 'circleicon' && <Circle height={height} width={width} color={color} />}
			{iconName == 'present' && <PresentAtTime height={height} width={width} color={color} />}
			{iconName == 'late' && <LateAtATime height={height} width={width} color={color} />}
			{iconName == 'absent' && <AbsentAtATime height={height} width={width} color={color} />}
			{iconName == 'excused' && <ExcusedIcon height={height} width={width} color={color} />}
			{iconName == 'fullSeatsIcon' && <FullSeatsIcon height={height} width={width} color={color} />}
			{iconName == 'folderIcon' && <FolderIcon height={height} width={width} color={color} />}
			{iconName == 'visibilityIcon' && <VisibilityIcon height={height} width={width} color={color} />}
			{iconName == 'visibilityOffIcon' && <VisibilityOffIcon height={height} width={width} color={color} />}
			{iconName == 'keyBoardDownIcon' && <KeyBoardDownIcon height={height} width={width} color={color} />}
			{iconName == 'menuIcon' && <MenuIcon height={height} width={width} color={color} />}
			{iconName == 'rightArrowIcon' && <RightArrowIcon height={height} width={width} color={color} />}
			{iconName == 'checkCircleRoundIcon' && <CheckCircleRoundIcon height={height} width={width} color={color} />}
			{iconName == 'downloadIcon' && <DownloadIcon height={height} width={width} color={color} />}
			{iconName == 'redBook' && <RedBook height={height} width={width} color={color} />}
			{iconName == 'greenBook' && <GreenBook height={height} width={width} color={color} />}
			{iconName == 'appleStore' && <AppleStore height={height} width={width} color={color} />}


			{iconName == 'studentOneIcon' && <StudentOneIcon height={height} width={width} color={color} strockColor={strockColor} />}
			{iconName == 'studentTwoIcon' && <StudentTwoIcon height={height} width={width} color={color} strockColor={strockColor} />}
			{iconName == 'studentThreeIcon' && <StudentThreeIcon height={height} width={width} color={color} strockColor={strockColor} />}

		</>
	)
}

export default AllIconsComponenet