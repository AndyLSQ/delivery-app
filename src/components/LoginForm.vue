<script setup>
	import { computed, ref } from 'vue';
	import { userService } from '@/services/userService.js';

	const userLogin = userService();
	// const usernameInput = ref(''); -- moved to store
	const user = userService();
</script>

<template>
	<button @click="userLogin.closeModal()">X</button>
	<h1 class="loud-voice">Sign In</h1>
	<button v-if="user.current" @click="user.logout">Log out</button>
	<form v-if="!user.current" action="" @submit.prevent="user.login()">
		<label for="usernameInputField">Username</label>
		<input id="usernameInputField" type="text" v-model="user.formInput.username" />
		<button type="submit">Submit</button>
	</form>
	<p>Admin? {{ user.isAdmin }}</p>
	<p>Current user: {{ user.current }}</p>
</template>

<style scoped></style>
