import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useLoginStore = defineStore('login', function () {
	const loggedIn = ref(false);

	function toggleLogin() {
		console.log(loggedIn.value);
		loggedIn.value = !loggedIn.value;
	}

	const loginClass = computed(function () {
		if (loggedIn.value) {
			return 'logged-in';
		} else {
			return 'logged-out';
		}
	});

	const loginButton = computed(function () {
		if (loggedIn.value) {
			return 'Log Out';
		} else {
			return 'Log In';
		}
	});
	return { loggedIn, toggleLogin, loginClass, loginButton };
});
