<script setup>
	import { ref, onMounted } from 'vue';
	import { userService } from '@/services/userService';
	// Icons
	import SvgIcons from '@/components/icons/IconTemplate.vue';
	import LoginForm from '@/components/LoginForm.vue';

	const user = userService();
</script>

<template>
	<div class="welcome">
		<div class="logo">
			<SvgIcons class="svg-icons" name="logo-dark" />
			DishList
		</div>
		<h1 class="loud-voice">Fresh. Local. Fast.</h1>
		<p class="voice2">Quality meals at your doorstep</p>
		<p>Exclusively serving the Austin community</p>

		<LoginForm />

		<button @click="user.dismissWelcome()">Continue as guest</button>
		<!-- <button @click="user.showwelcome()">Show welcome</button> -->
		<!-- {{ user.welcomeShown }} -->
	</div>
</template>

<style scoped>
	.welcome {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.logo {
		display: flex;
		gap: 0.75rem;
		font-family: 'Courgette', cursive;
		align-items: center;
		justify-content: center;
		/*		font-size: 2.5rem;*/
	}
	.logo .svg-icons {
		width: 2rem;
		height: 2rem;
	}

	.signupForm {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		width: 600px;
	}

	.passwordField {
		grid-column: 1/3;
	}

	.submitSignup {
		display: grid;
		grid-column: 1/3;
		place-content: center;
		border: 2px solid red;
	}
</style>
