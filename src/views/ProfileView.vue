<script setup>
	import { ref, reactive, watch } from 'vue';
	import { updateDoc } from 'firebase/firestore';
	import { userService } from '@/services/userService';

	const user = userService();

	// TODO set up an "orignal object in case user wants to cancel edits"

	// Original setup - fully reactive
	// watch(user, function (a, b) {
	// 	form.firstName = user.info.firstName;
	// 	form.lastName = user.info.lastName;
	// });

	// EDIT
	const form = reactive({
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		phone: user.phone,
	});

	const profileEditing = ref(false);

	function editUser() {
		profileEditing.value = true;
		form.firstName = user.firstName;
		form.lastName = user.lastName;
		form.email = user.email;
		form.phone = user.phone;
	}

	function clearEdit() {
		profileEditing.value = false;
	}

	async function submitUpdate() {
		await user.updateProfile(form);
		await clearEdit();
		alert('Profile update successful');
	}
</script>

<template>
	<h1 class="voice1">Profile</h1>

	<div class="userInfo">
		<div
			class="userField"
			v-if="user.firstName"
		>
			First Name: {{ user.firstName }}
		</div>
		<div
			class="userField"
			v-if="user.lastName"
		>
			Last Name: {{ user.lastName }}
		</div>
		<div class="userField">Email: {{ user.email }}</div>
		<div
			class="userField"
			v-if="user.phone"
		>
			Phone: {{ user.phone }}
		</div>
	</div>

	<button
		v-if="!profileEditing"
		@click="editUser(user.authUser.uid)"
	>
		Edit
	</button>
	<button
		v-if="profileEditing"
		@type="button"
		@click="clearEdit"
	>
		Cancel
	</button>

	<form
		v-if="profileEditing"
		@submit.prevent="submitUpdate()"
	>
		<div class="field">
			<label for="firstName">First Name</label>
			<input
				id="firstName"
				type="text"
				v-model="form.firstName"
				required
			/>
		</div>
		<div class="field">
			<label for="lastName">Last Name</label>
			<input
				id="lastName"
				type="text"
				v-model="form.lastName"
				required
			/>
		</div>
		<div class="field">
			<label for="email">Email</label>
			<input
				id="email"
				type="text"
				v-model="form.email"
				required
			/>
		</div>
		<div class="field">
			<label for="phoneNumber">Phone Number</label>
			<input
				id="phoneNumber"
				type="tel"
				v-model="form.phone"
				required
			/>
		</div>

		<button @type="submit">Update</button>
	</form>
</template>

<style scoped></style>
