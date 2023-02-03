import { ref, reactive, onMounted, computed } from 'vue';
import { defineStore } from 'pinia';

export const userService = defineStore('user', function () {
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
	};
});
