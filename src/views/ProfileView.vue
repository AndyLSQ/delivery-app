<script setup>
	import { ref, reactive, watch } from 'vue';
	import { updateDoc } from 'firebase/firestore';
	import { userService } from '@/services/userService';

	const user = userService();
	// const formFirstName = ref('');
	// const db = useFirestore();

	watch(user, function (a, b) {
		form.firstName = user.info.firstName;
	});

	const form = reactive({
		firstName: user.info.firstName,
	});
</script>

<template>
	<h1 class="voice1">Your Profile</h1>

	<p>INFO: {{ user?.info.firstName }}</p>

	<form @submit.prevent="user.updateProfile(form)">
		<div class="field">
			<label for="firstName">First Name</label>
			<input id="firstName" type="text" v-model="form.firstName" />
		</div>
		<div class="field">
			<label for="lastName">Last Name</label>
			<input id="lastName" type="text" />
		</div>
		<div class="field">
			<label for="email">Email</label>
			<input id="email" type="text" />
		</div>
		<div class="field">
			<label for="phoneNumber">Phone Number</label>
			<input id="phoneNumber" type="text" />
		</div>
		<button>Submit</button>
	</form>
</template>

<style scoped></style>
