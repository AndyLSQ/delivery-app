import { ref, reactive, onMounted, computed } from 'vue';
import { defineStore } from 'pinia';
import { useRouter, useRoute } from 'vue-router';

import { doc, collection, setDoc, updateDoc } from 'firebase/firestore';

import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as fbSignOut,
} from 'firebase/auth';

import { useCurrentUser, useFirestore, useDocument } from 'vuefire';

// ======== GET USER AUTH DOCS ========
// Function: If there is a current user, get their doc
function useUser() {
	const db = useFirestore();
	const authUser = useCurrentUser();

	const docReference = computed(function () {
		if (authUser.value) {
			return doc(collection(db, 'users'), authUser.value.uid);
		} else {
			return false;
		}
	});

	const userDoc = useDocument(docReference);

	const isAdmin = computed(function () {
		return userDoc.value?.roles.admin;
	});

	// Set constants for user data fields
	const roles = computed(() => userDoc.value?.roles);
	const firstName = computed(() => userDoc.value?.firstName);
	const lastName = computed(() => userDoc.value?.lastName);
	const email = computed(() => userDoc.value?.email);
	const phone = computed(() => userDoc.value?.phone);

	const address = computed(() => userDoc.value?.address);
	const city = computed(() => userDoc.value?.city);
	const state = computed(() => userDoc.value?.state);
	const zip = computed(() => userDoc.value?.zip);

	// Return all of them
	return { isAdmin, roles, firstName, lastName, email, phone, address, city, state, zip };
}

// ======== EXPORT ============
export const userService = defineStore('user', function () {
	// ROUTER (for sign in redirect)
	const router = useRouter();
	const route = useRoute();

	// ======== SIGNUP & SIGNIN ========
	const auth = getAuth();

	const currentFB = useCurrentUser();

	const form = reactive({
		username: '',
		password: '',
		// role: "",
	});

	const db = useFirestore();

	const errorMessage = ref(null);

	function resetErrorMessage() {
		errorMessage.value = null;
	}

	function clearForm() {
		form.username = '';
		form.password = '';
		// form.role = '';
	}

	const { isAdmin, ...info } = useUser();

	function signUp(email, password) {
		createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				//signed in
				// NEW ---------
				console.log(userCredential.user.uid);
				const newUserId = userCredential.user.uid;
				try {
					await setDoc(doc(db, 'users', newUserId), {
						username: '',
						email: email,
						roles: {
							admin: true,
						},
					});
				} catch (error) {
					console.log(error.message);
				}

				console.log('user.signUp');
				clearForm();
			})
			.catch((error) => {
				errorMessage.value = error.message;
				console.log('ERROR MESSAGE', error.message);
			});
	}

	function signIn(email, password) {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				clearForm();
				// Signed in
				// const user = userCredential.user;
				router.push(route.query.redirect || '/');
				closeModal();
			})
			.catch((error) => {
				errorMessage.value = error.message;
			});
	}

	function signOut() {
		console.log('sign out initiated');
		fbSignOut(auth)
			.then(() => {
				console.log('sign out successful');
				router.push(route.query.redirect || '/welcome');
				closeModal();
				// Sign-out successful.
			})
			.catch((error) => {
				console.log(error);
				// An error happened.
			});
	}

	// ======== UPDATE USER INFO ========
	function updateProfile(formData) {
		updateDoc(doc(db, 'users', currentFB.value.uid), formData);
	}

	// ========OLD============

	// const users = [
	// {
	// 	username: 'tom',
	// 	password: '123',
	// 	address: '',
	// 	phone: '',
	// },
	// {
	// 	username: 'bill',
	// 	password: '999',
	// 	address: '',
	// 	phone: '',
	// 	role: 'admin',
	// },
	// ];

	// const current = ref(null);

	// function logout() {
	// 	current.value = null;
	// }

	// const formInput = reactive({
	// 	username: '',
	// 	password: '',
	// });

	// function clearForm() {
	// 	formInput.username = '';
	// 	formInput.password = '';
	// }

	// function login() {
	// 	console.log('username: ', formInput.username);
	// 	const found = users.find(function (user) {
	// 		return user.username == formInput.username;
	// 	});

	// 	if (found) {
	// 		current.value = found;
	// 		clearForm();
	// 	} else {
	// 		alert('invalid user!!');
	// 	}
	// }

	// const loggedIn = computed(function () {
	// 	if (current.value) {
	// 		return true;
	// 		console.log('loggedIn is true');
	// 	} else {
	// 		console.log('loggedIn is false');
	// 		return false;
	// 	}
	// });

	// =======LOGIN MODAL========
	const modalOpen = ref(false);

	function openModal() {
		modalOpen.value = true;
	}

	function closeModal() {
		modalOpen.value = false;
		// clearForm();
	}

	// =======Welcome TOGGLE========
	// const WelcomeShown = ref(true);
	const welcomeShown = ref(window.localStorage.getItem('showWelcome'));

	function showWelcome() {
		window.localStorage.setItem('showWelcome', true);
		setWelcome();
	}

	function dismissWelcome() {
		window.localStorage.setItem('showWelcome', false);
		setWelcome();
	}

	function setWelcome() {
		welcomeShown.value = window.localStorage.getItem('showWelcome');
	}

	// onMounted(function () {
	// 	if (window.localStorage.showWelcome) {
	// 		console.log('showWelcome already exists in LS');
	// 	} else {
	// 		console.log('showWelcome doesnt yet exist in LS, so set it to true');
	// 		window.localStorage.setItem('showWelcome', true);
	// 		// user.setWelcome();
	// 	}
	// });

	return {
		// users,
		// login,
		// logout,
		// loggedIn,
		// current,
		// formInput,
		currentFB,
		form,
		signUp,
		signOut,
		signIn,
		errorMessage,
		resetErrorMessage,
		modalOpen,
		openModal,
		closeModal,
		welcomeShown,
		setWelcome,
		showWelcome,
		dismissWelcome,
		info,
		isAdmin,
		updateProfile,
	};
});
