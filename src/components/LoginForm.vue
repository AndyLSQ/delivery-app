<script setup>
	import { computed, ref } from 'vue';
	import { userService } from '@/services/userService.js';

	// const usernameInput = ref(''); -- moved to store
	const user = userService();
</script>

<template>
	<form action="" @submit.prevent="user.login()">
		<label for="usernameInputField">Username</label>
		<input id="usernameInputField" type="text" v-model="user.formInput.username" />
		<button type="submit">Submit</button>
	</form>
	Admin? {{ user.isAdmin }} Current user: {{ user.current }}
</template>

<style scoped></style>
