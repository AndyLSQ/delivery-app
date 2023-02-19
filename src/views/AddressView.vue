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
		address: user.info.address,
		city: user.info.city,
		state: user.info.state,
		zip: user.info.zip,
	});

	const profileEditing = ref(false);

	function editUser() {
		profileEditing.value = true;
		form.address = user.info.address;
		form.city = user.info.city;
		form.state = user.info.state;
		form.zip = user.info.zip;
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
			v-if="user?.info.address"
		>
			{{ user?.info.address }}
		</div>
		<div
			class="userField"
			v-if="user?.info.city && user?.info.state && user?.info.zip"
		>
			{{ user?.info.city }}, {{ user?.info.state }} {{ user?.info.zip }}
		</div>
		<div
			class="userField"
			v-if="user?.info.state"
		>
			State: {{ user?.info.state }}
		</div>
		<div
			class="userField"
			v-if="user?.info.zip"
		>
			Zip: {{ user?.info.zip }}
		</div>
	</div>

	<button
		v-if="!profileEditing"
		@click="editUser(user.currentFB.uid)"
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
