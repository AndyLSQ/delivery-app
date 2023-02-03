<script setup>
	import { ref, computed, onBeforeMount, onMounted } from 'vue';
	import { useRoute } from 'vue-router';
	import { userService } from '@/services/userService';

	const user = userService();
	const route = useRoute();
</script>

<template>
	<h1 class="voice1">Account View</h1>
	<p>Username: {{ user.current.username }}</p>

	<h2 class="voice2">Personal Info</h2>
	<form>
		<div class="field">
			<label for="firstName">First Name</label>
			<input id="firstName" type="text" />
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
		<div class="field">
			<label for="address">Street Address</label>
			<input id="address" type="text" />
		</div>
		<div class="field">
			<label for="city">City</label>
			<input id="city" type="text" />
		</div>
		<div class="field">
			<label for="state">State</label>
			<input id="state" type="text" />
		</div>
		<div class="field">
			<label for="zipCode">Zip Code</label>
			<input id="zipCode" type="text" />
		</div>
	</form>
</template>

<style></style>
