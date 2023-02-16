import { ref, reactive, onMounted, computed } from 'vue';
import { defineStore } from 'pinia';
import { useRouter, useRoute } from 'vue-router';

import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as fbSignOut,
} from 'firebase/auth';

import { useCurrentUser } from 'vuefire';

export const userService = defineStore('user', function () {
	// ======== ROUTER (for sign in redirect) ============
	const router = useRouter();
	const route = useRoute();

	// ======== FB-AUTH ============
	const auth = getAuth();

	const currentFB = useCurrentUser();

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

	function signUp(email, password) {
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				//signed in
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
				console.log('user.signin');
				// errorMessage.value = null;
				clearForm();
				// Signed in
				// const user = userCredential.user;
				// ...
			})
			.catch((error) => {
				// console.log(error.code, error.message);
				// const errorCode = error.code;
				errorMessage.value = error.message;
				console.log('ERROR MESSAGE', error.message);
			});
	}

	function signOut() {
		console.log('sign out initiated');
		fbSignOut(auth)
			.then(() => {
				console.log('sign out successful');
				// Sign-out successful.
			})
			.catch((error) => {
				console.log(error);
				// An error happened.
			});
	}

	// ====================
	const users = [
		{
			username: 'tom',
			password: '123',
			address: '',
			phone: '',
		},
		{
			username: 'bill',
			password: '999',
			address: '',
			phone: '',
			role: 'admin',
		},
	];

	const current = ref(null);

	function logout() {
		current.value = null;
	}

	const formInput = reactive({
		username: '',
		password: '',
	});

	function clearForm() {
		formInput.username = '';
		formInput.password = '';
	}

	function login() {
		console.log('username: ', formInput.username);
		const found = users.find(function (user) {
			return user.username == formInput.username;
		});

		if (found) {
			current.value = found;
			clearForm();
		} else {
			alert('invalid user!!');
		}
	}

	const loggedIn = computed(function () {
		if (current.value) {
			return true;
			console.log('loggedIn is true');
		} else {
			console.log('loggedIn is false');
			return false;
		}
	});

	const isAdmin = computed(function () {
		return current.value?.role == 'admin';
		// if (current.value) {
		// 	return current.value?.role == 'admin';
		// } else {
		// 	return false;
		// }
	});

	// =======LOGIN MODAL========
	const modalOpen = ref(false);

	function openModal() {
		modalOpen.value = true;
	}

	function closeModal() {
		modalOpen.value = false;
		// clearForm();
	}

	// =======HERO TOGGLE========
	// const heroShown = ref(true);
	const heroShown = ref(window.localStorage.getItem('showHero'));

	function showHero() {
		window.localStorage.setItem('showHero', true);
		setHero();
	}

	function dismissHero() {
		window.localStorage.setItem('showHero', false);
		setHero();
	}

	function setHero() {
		heroShown.value = window.localStorage.getItem('showHero');
	}

	// onMounted(function () {
	// 	if (window.localStorage.showHero) {
	// 		console.log('showHero already exists in LS');
	// 	} else {
	// 		console.log('showHero doesnt yet exist in LS, so set it to true');
	// 		window.localStorage.setItem('showHero', true);
	// 		// user.setHero();
	// 	}
	// });

	return {
		users,
		login,
		logout,
		loggedIn,
		current,
		isAdmin,
		formInput,
		modalOpen,
		openModal,
		closeModal,
		heroShown,
		setHero,
		showHero,
		dismissHero,
		signUp,
		form,
		currentFB,
		signOut,
		signIn,
		errorMessage,
		resetErrorMessage,
	};
});
