import { initializeApp } from "firebase/app";
import {
	getAuth, signInWithPopup, GoogleAuthProvider,
	signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateEmail,
	updatePassword
} from "firebase/auth";
import Router from "next/router";
import { toast } from "react-toastify";
import { updateProfile } from "./apisService";
import * as fbq from '../lib/fpixel'



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
const provider = new GoogleAuthProvider();


export const GoogleLogin = async () => {
	return await signInWithPopup(auth, provider);
};


export const forgotPassword = async (email) => {
	await sendPasswordResetEmail(auth, email).then((res) => {
		toast.success(" تم ارسال رابط الى ايميلك لتغيير كلمة السر")
		Router.push('/login')
	}).catch((error) => {
		const errorCode = error.code;
		const errorMessage = error.message;
		console.error(`Error creating new user: ${errorCode} - ${errorMessage}`);
	});
}


export const signupWithEmailAndPassword = async (email, password, firstName, lastName, phoneNumber, gender) => {
	await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
		const body = {
			firstName: firstName,
			lastName: lastName,
			fullName: firstName + " " + lastName,
			phone: phoneNumber.replace(/[0-9]/, "+966"),
			gender: gender
		}
		const params = {
			data: body,
			accessToken: userCredential?.user?.accessToken
		}
		await updateProfile(params).then(res => {
			Router.push('/login')
			fbq.event('Sign up', { email: email })
		}).catch(error => {
			toast.error(error.message)
			console.log(error)
		});
	}).catch((error) => {
		console.log(error);
		if (error.code == 'auth/email-already-in-use') {
			toast.error('الايميل مستخدم مسبقًا')
		}
	});
}


export const startEmailPasswordLogin = async (email, password) => {
	return await signInWithEmailAndPassword(auth, email, password);
}


export const signOutUser = async (returnUrl) => {
	signOut(auth).then(() => {
		localStorage.clear();
		Router.push(returnUrl?.url ? returnUrl?.url : '/login')
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
let tokenRefreshTimer;

const scheduleTokenRefresh = async (user) => {
	if (!user) return;

	tokenRefreshTimer = setTimeout(async () => {
		try {
			const idToken = await user.getIdToken();
			scheduleTokenRefresh(user);
		} catch (error) {
			console.error("Error refreshing token:", error);
		}
	}, 200000);
};

const clearTokenRefreshTimer = () => {
	if (tokenRefreshTimer) {
		clearTimeout(tokenRefreshTimer);
	}
};

auth.onAuthStateChanged((user) => {
	if (user) {
		scheduleTokenRefresh(user);
	} else {
		clearTokenRefreshTimer();
	}
});