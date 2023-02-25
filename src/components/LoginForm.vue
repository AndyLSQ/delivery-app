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
	}
</script>

<template>
	<!-- NEW -->
	<button
		v-if="user.modalOpen"
		@click="user.closeModal()"
	>
		Close
	</button>
	<div v-if="user.authUser">
		<button
			type="button"
			@click="user.signOut()"
		>
			signout
		</button>
		<p>email: {{ user.authUser.email }}</p>
	</div>
	<div
		class="authForm"
		v-if="!user.authUser"
	>
		<!-- ==== SIGN UP FORM ==== -->
		<form
			@submit.prevent="user.signUp(user.form.username, user.form.password)"
			v-if="authType == 'signUp'"
		>
			<h2 class="voice1">Sign Up</h2>
			<div class="form-field">
				<label for="email1">email</label>
				<input
					id="email1"
					type="text"
					v-model="user.form.username"
				/>
			</div>
			<div class="form-field password">
				<label for="password1">password</label>
				<input
					id="password1"
					:type="passwordVisibility"
					v-model="user.form.password"
					required
				/>
				<div
					class="pwToggleContain"
					@click="togglePasswordVisibility()"
				>
					<SvgIcons
						class="pwToggle"
						name="show"
						v-if="passwordVisibility == 'password'"
					/>
					<SvgIcons
						class="pwToggle"
						name="hide"
						v-if="passwordVisibility == 'text'"
					/>
				</div>
			</div>
			<button type="submit">Sign up</button>
			<div v-if="user.errorMessage">{{ user.errorMessage }}</div>
			<div class="authToggle">
				<p>Already have an account?</p>
				<button
					type="button"
					@click="toggleAuthScreen()"
				>
					Sign in
				</button>
			</div>
		</form>

		<!-- ==== SIGN IN FORM ==== -->
		<form
			@submit.prevent="user.signIn(user.form.username, user.form.password)"
			v-if="authType == 'signIn'"
		>
			<h2 class="voice1">Sign In</h2>
			<div class="form-field">
				<label for="email2">email</label>
				<input
					id="email2"
					type="text"
					v-model="user.form.username"
				/>
			</div>
			<div class="form-field password">
				<label for="password2">password</label>
				<input
					id="password2"
					:type="passwordVisibility"
					v-model="user.form.password"
					required
				/>
				<div
					class="pwToggleContain"
					@click="togglePasswordVisibility()"
				>
					<SvgIcons
						class="pwToggle"
						name="show"
						v-if="passwordVisibility == 'password'"
					/>
					<SvgIcons
						class="pwToggle"
						name="hide"
						v-if="passwordVisibility == 'text'"
					/>
				</div>
				<!-- <button type="button" @click="togglePasswordVisibility()">Show/Hide Password</button> -->
			</div>
			<button type="submit">Sign in</button>
			<div v-if="user.errorMessage">{{ user.errorMessage }}</div>
			<div class="authToggle">
				<p>Don't have an account yet?</p>
				<button
					type="button"
					@click="toggleAuthScreen()"
				>
					Sign up
				</button>
			</div>
		</form>
	</div>
</template>

<style scoped>
	.form-field.password {
		border: 2px solid red;
		display: flex;
		/*		justify-content: center;*/
		align-items: center;
	}
	.pwToggleContain {
		display: block;
		border: 3px solid blue;
		width: 2rem;
		height: 2rem;
		cursor: pointer;
	}
	.pwToggle {
		display: block;
		width: 100%;
		height: 100%;
		/*display: grid;
		place-items: center;*/
	}
</style>
