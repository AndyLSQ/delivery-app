<script setup>
	import { computed, ref } from 'vue';
	import { userService } from '@/services/userService.js';
	const user = userService();
	// const usernameInput = ref(''); -- moved to store
	// const user = userService();
</script>

<template>
	<!-- OLD -->
	<!-- <button @click="userLogin.closeModal()">X</button>
	<h1 class="loud-voice">Sign In</h1>
	<button v-if="user.current" @click="user.logout">Log out</button>
	<form v-if="!user.current" action="" @submit.prevent="user.login()">
		<label for="usernameInputField">Username</label>
		<input id="usernameInputField" type="text" v-model="user.formInput.username" />
		<button type="submit">Submit</button>
	</form> -->
	<!-- <p>Admin? {{ user.isAdmin }}</p> -->
	<!-- <p>Current user: {{ user.current }}</p> -->

	<!-- NEW -->
	<h1>HELLO</h1>
	<button type="button" @click="user.signOut()" v-if="user.currentFB">signout</button>
	<div v-if="user.currentFB">
		<p>email: {{ user.currentFB.email }}</p>
		<!-- <p>email: {{ user.current.email }}</p> -->
	</div>

	<form
		@submit.prevent="user.signUp(user.form.username, user.form.password)"
		v-if="!user.currentFB"
	>
		<h2>Sign up</h2>
		<!-- <p>{{ user.form }}</p> -->
		<div class="form-field">
			<label for="email1">email</label>
			<input id="email1" type="text" v-model="user.form.username" />
		</div>
		<div class="form-field">
			<label for="password1">password</label>
			<input id="password1" type="text" v-model="user.form.password" />
		</div>
		<button type="submit">Sign up</button>
	</form>
</template>

<style scoped></style>
