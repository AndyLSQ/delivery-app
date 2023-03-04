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
		@click="user.closeModal()"
		class="closeX"
	>
		<SvgIcons
			class="svg-icons"
			name="close"
		/>
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
			<h2 class="voice1 highlight-voice">Sign Up</h2>
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
				<div class="password-input-field">
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
			</div>
			<button
				type="submit"
				class="default-button1"
			>
				Sign up
			</button>
			<div v-if="user.errorMessage">{{ user.errorMessage }}</div>
			<div class="authToggle">
				<p>
					Already have an account?
					<button
						class="inline-link"
						type="button"
						@click="toggleAuthScreen()"
					>
						Sign in
					</button>
				</p>
			</div>
		</form>

		<!-- ==== SIGN IN FORM ==== -->
		<form
			@submit.prevent="user.signIn(user.form.username, user.form.password)"
			v-if="authType == 'signIn'"
		>
			<h2 class="voice1 highlight-voice">Sign In</h2>
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
				<div class="password-input-field">
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
				</div>
				<!-- <button type="button" @click="togglePasswordVisibility()">Show/Hide Password</button> -->
			</div>
			<button
				type="submit"
				class="default-button1"
			>
				Sign in
			</button>
			<div v-if="user.errorMessage">{{ user.errorMessage }}</div>
			<div class="authToggle">
				<p>
					Don't have an account yet?
					<button
						class="inline-link"
						type="button"
						@click="toggleAuthScreen()"
					>
						Sign up
					</button>
				</p>
			</div>
		</form>
	</div>
</template>

<style scoped>
	template {
		/*		position: relative;*/
	}

	.dialogue {
		color: red;
		border: 10px solid red;
	}

	.closeX {
		position: absolute;
		top: 8px;
		left: 8px;
	}

	.form-field.password {
		/*		border: 2px solid red;*/
		align-items: center;
		/*		position: relative;*/
	}
	.password-input-field {
		/*		border: 3px solid purple;*/
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
	}

	.password-input-field input {
		/*		width: 100%;*/
	}

	.pwToggleContain {
		display: block;
		/*		border: 3px solid blue;*/
		width: 1.75rem;
		height: 1.75rem;
		cursor: pointer;
		position: absolute;
		right: 1em;
		/*		top: 0;*/
	}
	.pwToggle {
		display: block;
		width: 100%;
		height: 100%;
		fill: var(--light-ink);
		/*display: grid;
		place-items: center;*/
	}
</style>
