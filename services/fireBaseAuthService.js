import { initializeApp } from "firebase/app";
import {
	getAuth, signInWithPopup, GoogleAuthProvider,
	signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateEmail,
	updatePassword,
	OAuthProvider,
	getIdToken,
	onAuthStateChanged
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
		
		// Preserve payment form data before clearing localStorage
		const paymentFormData = localStorage.getItem('paymentFormData');
		
		// Clear localStorage
		localStorage.clear();
		
		// Restore payment form data if it existed (for 401 redirect flow)
		if (paymentFormData) {
			localStorage.setItem('paymentFormData', paymentFormData);
		}

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
		// Preserve payment form data before clearing localStorage
		const paymentFormData = localStorage.getItem('paymentFormData');
		
		localStorage.clear();
		
		// Restore payment form data if it existed (for 401 redirect flow)
		if (paymentFormData) {
			localStorage.setItem('paymentFormData', paymentFormData);
		}
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

/**
 * Get a fresh ID token from Firebase for the given user.
 * Use this after login instead of user.accessToken (which is deprecated).
 */
export const getFreshIdToken = async (user) => {
	try {
		const idToken = await getIdToken(user, false);
		localStorage.setItem("accessToken", idToken);
		console.log('[Auth] Fresh ID token obtained and stored');
		return idToken;
	} catch (error) {
		console.error('[Auth] Failed to get ID token:', error);
		throw error;
	}
};

export const getNewToken = async () => {
	// Wait for Firebase auth state to be ready
	const user = await new Promise((resolve) => {
		// Check if we already have current user
		if (auth.currentUser) {
			console.log('[Auth] Current user already available');
			resolve(auth.currentUser);
			return;
		}
		
		console.log('[Auth] Waiting for auth state to restore...');
		let resolved = false;
		let timeoutId;
		
		// Wait for auth state to be restored (happens after page reload)
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!resolved) {
				resolved = true;
				clearTimeout(timeoutId);
				unsubscribe();
				console.log('[Auth] Auth state restored, user:', user ? 'found' : 'not found');
				resolve(user);
			}
		});
		
		// Timeout after 10 seconds to prevent infinite waiting
		timeoutId = setTimeout(() => {
			if (!resolved) {
				resolved = true;
				unsubscribe();
				console.log('[Auth] Auth state check timed out');
				resolve(null);
			}
		}, 10000);
	});

	if (user) {
		try {
			// Force refresh the token to get a new one
			const idToken = await getIdToken(user, true);
			localStorage.setItem("accessToken", idToken);
			console.log('[Auth] Token refreshed successfully');
			return idToken;
		} catch (error) {
			console.error('[Auth] Token refresh failed:', error);
			throw error;
		}
	} else {
		console.log('[Auth] User is not signed in, redirecting to login');
		await signOutUser();
		Router.push('/login');
		throw new Error('User not authenticated');
	}
};