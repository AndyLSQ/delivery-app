import { ref, reactive, computed } from 'vue';
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

	function logout() {}

	const current = ref(null);

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

	return {
		users,
		login,
		logout,
		loggedIn,
		current,
		isAdmin,
		formInput,
	};
});
