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

// ======== EXPORT ============
export const userService = defineStore('user', function () {
	// ROUTER (for sign in redirect)
	const router = useRouter();
	const route = useRoute();

	// ======== SIGNUP & SIGNIN ========
	const auth = getAuth();

	const authUser = useCurrentUser();

	// MOVE USEUSER STUFF HERE
	const db = useFirestore();

	const docReference = computed(function () {
		if (authUser.value) {
			return doc(collection(db, 'users'), authUser.value.uid);
		} else {
			return false;
		}
	});

	const { data: userDoc, promise: isUserLoadedPromise } = useDocument(docReference);
	// globalUserDoc.value = userDoc;

	const isAdmin = computed(function () {
		return userDoc.value?.roles.admin;
	});

	// Set constants for user data fields
	const roles = computed(() => userDoc.value?.roles);
	const firstName = computed(() => userDoc.value?.firstName);
	const lastName = computed(() => userDoc.value?.lastName);
	const email = computed(() => authUser.value?.email);
	const phone = computed(() => userDoc.value?.phone);

	const address = computed(() => userDoc.value?.address);
	const city = computed(() => userDoc.value?.city);
	const state = computed(() => userDoc.value?.state);
	const zip = computed(() => userDoc.value?.zip);

	const favoriteRestaurants = computed(() => userDoc.value?.favoriteRestaurants);

	// ==== USER LOAD PROMISE ====

	const form = reactive({
		username: '',
		password: '',
		// role: "",
	});

	const errorMessage = ref(null);

	function resetErrorMessage() {
		errorMessage.value = null;
	}

	function clearForm() {
		form.username = '';
		form.password = '';
		// form.role = '';
	}

	// PULLS IN USER DATA FROM FUNCTION BEFORE THE EXPORT

	function signUp(email, password) {
		createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				//signed in
				// NEW ---------
				console.log(userCredential.user.uid);
				const newUserId = userCredential.user.uid;
				try {
					await setDoc(doc(db, 'users', newUserId), {
						// username: '',
						email: email,
						roles: {
							admin: true,
						},
						favoriteRestaurants: [],
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
		updateDoc(doc(db, 'users', authUser.value.uid), formData);
	}

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

	// =============== FAVORITES ===============

	function toggleFavorite(restaurantId) {
		if (alreadyFavorite(restaurantId)) {
			console.log('ALREADY A FAVE');
			removeFavorite(restaurantId);
		} else {
			console.log('FAVE NOT FOUND');
			console.log('favoriteRestaurants: ', favoriteRestaurants.value);
			addFavorite(restaurantId);
		}
	}

	function alreadyFavorite(restaurantId) {
		if (favoriteRestaurants) {
			return favoriteRestaurants?.value.find(function (favorite) {
				return favorite == restaurantId;
			});
		} else {
			return false;
		}
	}

	function addFavorite(favoriteId) {
		favoriteRestaurants.value.push(favoriteId);
		updateFavorites(favoriteRestaurants.value);
	}

	function removeFavorite(excludeId) {
		const newFavoriteRestaurants = favoriteRestaurants.value.filter(function (itemId) {
			return excludeId != itemId;
		});
		updateFavorites(newFavoriteRestaurants);
	}

	async function updateFavorites(favoriteRestaurants) {
		await updateDoc(doc(db, 'users', authUser.value.uid), { favoriteRestaurants });
	}

	return {
		authUser,
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
		isAdmin,
		updateProfile,
		toggleFavorite,
		alreadyFavorite,
		isUserLoadedPromise,
		isAdmin,
		roles,
		firstName,
		lastName,
		email,
		phone,
		address,
		city,
		state,
		zip,
		favoriteRestaurants,
		// favoriteRestaurant,
	};
});
