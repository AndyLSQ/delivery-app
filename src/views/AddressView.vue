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
		address: user.address,
		city: user.city,
		state: user.state,
		zip: user.zip,
	});

	const profileEditing = ref(false);

	function editUser() {
		profileEditing.value = true;
		form.address = user.address;
		form.city = user.city;
		form.state = user.state;
		form.zip = user.zip;
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
	<h1 class="voice1">Address Book</h1>

	<div class="userInfo">
		<div
			class="userField"
			v-if="user.address"
		>
			{{ user.address }}
		</div>
		<div
			class="userField"
			v-if="user.city && user.state && user.zip"
		>
			{{ user.city }}, {{ user.state }} {{ user.zip }}
		</div>
		<div
			class="userField"
			v-if="user.state"
		>
			State: {{ user.state }}
		</div>
		<div
			class="userField"
			v-if="user.zip"
		>
			Zip: {{ user.zip }}
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
			<label for="address">Street Address</label>
			<input
				id="address"
				type="text"
				v-model="form.address"
			/>
		</div>
		<div class="field">
			<label for="city">City</label>
			<input
				id="city"
				type="text"
				v-model="form.city"
			/>
		</div>
		<div class="field">
			<label for="state">State</label>
			<input
				id="state"
				type="text"
				v-model="form.state"
			/>
		</div>
		<div class="field">
			<label for="zipCode">Zip Code</label>
			<input
				id="zipCode"
				type="number"
				pattern="[0-9]{5}"
				v-model="form.zip"
			/>
		</div>

		<button @type="submit">Update</button>
	</form>
</template>

<style scoped></style>
