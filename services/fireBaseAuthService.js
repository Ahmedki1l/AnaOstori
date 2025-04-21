import { initializeApp } from "firebase/app";
import {
	getAuth, signInWithPopup, GoogleAuthProvider,
	signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateEmail,
	updatePassword,
	OAuthProvider,
	getIdToken
} from "firebase/auth";
import Router from "next/router";
import { toast } from "react-toastify";
import { inputErrorMessages, toastErrorMessage, toastSuccessMessage } from "../constants/ar";



const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const oAuthProvider = new OAuthProvider('apple.com');


export const GoogleLogin = async () => {
	return await signInWithPopup(auth, googleProvider);
};
export const signInWithApple = async () => {
	return await signInWithPopup(auth, oAuthProvider)
}


export const forgotPassword = async (email) => {
	await sendPasswordResetEmail(auth, email).then((res) => {
		toast.success(toastSuccessMessage.forgotPasswordLinkSend, { rtl: true, });
		// Clear localStorage
		localStorage.clear();

		// Clear sessionStorage
		sessionStorage.clear();
		Router.push('/login')
	}).catch((error) => {
		console.log(error);
		toast.error(error.code == 'auth/user-not-found' && inputErrorMessages.newEmailToastMsg)
	});
}

export const signupWithEmailAndPassword = (email, password) => {
	return new Promise(async (resolve, reject) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			localStorage.setItem("accessToken", userCredential?.user?.accessToken);
			resolve(userCredential);
		} catch (error) {
			console.log(error);

			reject(error);
		}
	});
}


export const startEmailPasswordLogin = async (email, password) => {
	return await signInWithEmailAndPassword(auth, email, password);
}


export const signOutUser = async () => {
	signOut(auth).then(() => {
		localStorage.clear();
	}).catch((error) => {
		console.log(error);
	});
}


export const verifyPassword = async (email, password) => {
	return await signInWithEmailAndPassword(
		auth,
		email,
		password
	)
};

export const changeEmail = async (newEmail) => {
	return await updateEmail(auth.currentUser, newEmail);
};

export const handleUpdatePassword = async (newPassword) => {
	return await updatePassword(auth.currentUser, newPassword);
}

export const getNewToken = async () => {
	const user = auth.currentUser;

	if (user) {
		try {
			const idToken = await getIdToken(user);
			localStorage.setItem("accessToken", idToken);
			return idToken;
		} catch (error) {
			throw error;
		}
	} else {
		console.log('User is not signed in');
		await signOutUser();
		Router.push('/login');
	}
};