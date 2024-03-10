import { initializeApp } from "firebase/app";
import {
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
	getReactNativePersistence,
	initializeAuth,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Add this import

const firebaseConfig = {
	apiKey: "AIzaSyAYED5nwuTafwhL5rRY3dkeeKVf3zKrS0Y",
	authDomain: "chat-app-fbb0e.firebaseapp.com",
	projectId: "chat-app-fbb0e",
	storageBucket: "chat-app-fbb0e.appspot.com",
	messagingSenderId: "690102940913",
	appId: "1:690102940913:web:5e61a33fcc789f49fb2550",
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = getAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize other Firebase services (e.g., Firestore, Storage)
const storage = getStorage(app);
const db = initializeFirestore(app, {
	experimentalForceLongPolling: true,
});

// Update the signIn function to include AsyncStorage persistence
export function signIn(email, password) {
	return signInWithEmailAndPassword(auth, email, password);
}

// Update the signUp function to include AsyncStorage persistence
export function signUp(email, password) {
	return createUserWithEmailAndPassword(auth, email, password);
}

export { app, auth, storage, db };
