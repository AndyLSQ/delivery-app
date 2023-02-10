<script setup>
	import { computed, ref } from 'vue';
	import { userService } from '@/services/userService.js';
	const user = userService();
	const passwordVisibility = ref('password');

	// Icons
	import SvgIcons from '@/components/icons/IconTemplate.vue';

	const authType = ref('signIn');

	function toggleAuthScreen() {
		console.log('start: ', authType.value);
		if (authType.value == 'signUp') {
			authType.value = 'signIn';
			user.resetErrorMessage();
			console.log('end: ', authType.value);
		} else {
			authType.value = 'signUp';
			console.log('end: ', authType.value);
			user.resetErrorMessage();
		}
	}

	function togglePasswordVisibility() {
		if (passwordVisibility.value == 'password') {
			passwordVisibility.value = 'text';
		} else {
			passwordVisibility.value = 'password';
		}
		// console.log('pw value: ', passwordVisibility.value);
	}
</script>

<template>
	<!-- NEW -->
	<button type="button" @click="user.signOut()" v-if="user.currentFB">signout</button>
	<div v-if="user.currentFB">
		<p>email: {{ user.currentFB.email }}</p>
	</div>
	<form
		@submit.prevent="user.signUp(user.form.username, user.form.password)"
		v-if="!user.currentFB"
	>
		<h2 class="voice1">Sign Up</h2>
		<div class="form-field">
			<label for="email1">email</label>
			<input id="email1" type="text" v-model="user.form.username" />
		</div>
		<div class="form-field">
			<label for="password1">password</label>
			<input id="password1" :type="passwordVisibility" v-model="user.form.password" required />
			<button type="button" @click="togglePasswordVisibility()">Show/Hide Password</button>
		</div>
		<button type="submit">Sign up</button>
		<div>error message: {{ user.errorMessage }}</div>
	</form>

	<form @submit.prevent="user.signIn(user.form.username, user.form.password)" v-if="!user.current">
		<h2 class="voice1">Sign In</h2>
		<div class="form-field">
			<label for="email2">email</label>
			<input id="email2" type="text" v-model="user.form.username" />
		</div>
		<div class="form-field">
			<label for="password2">password</label>
			<input id="password2" :type="passwordVisibility" v-model="user.form.password" required />
			<button type="button" @click="togglePasswordVisibility()">Show/Hide Password</button>
		</div>
		<button type="submit">Sign in</button>
		<div>error message: {{ user.errorMessage }}</div>
	</form>
</template>

<style scoped></style>
