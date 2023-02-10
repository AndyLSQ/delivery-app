<script setup>
	import { ref, onMounted } from 'vue';
	import { userService } from '@/services/userService';
	// Icons
	import SvgIcons from '@/components/icons/IconTemplate.vue';
	import LoginForm from '@/components/LoginForm.vue';

	const user = userService();

	// function showHero() {
	// 	window.localStorage.setItem('showHero', true);
	// 	// setHero();
	// }
	// function dismissHero() {
	// 	window.localStorage.setItem('showHero', false);
	// 	user.setHero();
	// }

	// function setHero() {
	// 	user.heroShown.value = window.localStorage.getItem('showHero');
	// }

	// onMounted(function () {
	// 	if (window.localStorage.showHero) {
	// 		console.log('showHero already exists in LS');
	// 	} else {
	// 		console.log('showHero doesnt yet exist in LS, so set it to true');
	// 		window.localStorage.setItem('showHero', true);
	// 		// user.setHero();
	// 	}
	// });

	// const heroShown = ref(window.localStorage.getItem('showHero'));
</script>

<template>
	<div class="hero">
		<div class="logo">
			<SvgIcons class="svg-icons" name="logo-dark" />
			DishList
		</div>
		<h1 class="loud-voice">Fresh. Local. Fast.</h1>
		<p class="voice2">Quality meals at your doorstep</p>
		<p>Exclusively serving the Austin community</p>

		<LoginForm />

		<button @click="user.dismissHero()">Continue as guest</button>
		<!-- <button @click="user.showHero()">Show hero</button> -->
		<!-- {{ user.heroShown }} -->
	</div>
</template>

<style scoped>
	.hero {
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
