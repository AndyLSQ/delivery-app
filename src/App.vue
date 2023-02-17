<script setup>
	import { ref, onBeforeMount, onMounted } from 'vue';
	import { RouterLink, RouterView, useRoute } from 'vue-router';
	import SiteMenu from '@/components/SiteMenu.vue';
	import { useInterfaceStore } from '@/stores/interface';
	import { useRestaurantStore } from '@/stores/restaurants';
	import SvgSpriteComponent from '@/components/icons/SvgSprites.vue';
	import WelcomeView from '@/views/WelcomeView.vue';
	import SvgIcons from '@/components/icons/IconTemplate.vue';
	import LoginForm from '@/components/LoginForm.vue';
	import { userService } from '@/services/userService';

	const route = useRoute();

	// Stores
	const restaurantsData = useRestaurantStore();
	const ui = useInterfaceStore();
	const user = userService();

	// Listener - Escape modal
	document.addEventListener('keydown', (e) => {
		if (user.modalOpen && e.keyCode == 27) {
			user.closeModal();
		}
	});

	onMounted(function () {
		if (window.localStorage.showWelcome) {
			console.log('showWelcome already exists in LS');
		} else {
			console.log('showWelcome doesnt yet exist in LS, so set it to true');
			window.localStorage.setItem('showWelcome', true);
			// user.setWelcome();
		}
	});

	// const WelcomeShown = ref(true);
</script>

<template :key="route.params">
	<!-- Icons -->
	<SvgSpriteComponent />

	<button @click="user.dismissWelcome()">Hide Welcome</button>
	<button @click="user.showWelcome()">Show Welcome</button>
	<div class="delete">{{ user.welcomeShown }}</div>

	<div class="welcomeView" v-if="user.welcomeShown == 'true'">
		<WelcomeView />
	</div>

	<!-- Site menu -->
	<div class="standardView" v-else>
		<header v-bind:class="`${route.name} ${ui.menuClass}`">
			<div class="inner-column">
				<SiteMenu />
			</div>
		</header>

		<!-- Router view -->
		<main class="outlet">
			<div class="inner-column">
				<RouterView />
			</div>
		</main>
	</div>

	<!-- Login modal -->
	<Transition>
		<div class="modal" v-if="user.modalOpen" @click="user.closeModal()">
			<div class="dialogue" @click.stop><LoginForm /></div>
		</div>
	</Transition>

	<!-- Footer -->
	<footer>
		<div class="inner-column">
			<!-- DONT USE COLON IN FRONT OF NAME -->
			<a href="https://github.com/AndyLSQ/delivery-app" target="github">GitHub</a>
		</div>
	</footer>
</template>

<style scoped>
	/* TODO: MOVE THIS ALL INTO SITE MENU FILE	*/
	.site-menu {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.site-menu a {
		padding: 1em;
	}

	.router-link-active {
		border-bottom: 3px solid red;
	}

	@media (min-width: 500px) {
		.menu-toggle {
			display: none;
		}
	}

	@media (max-width: 500px) {
		.site-menu {
			display: none;
		}

		.menu-open .site-menu {
			display: flex;
			flex-direction: column;
			position: fixed;
			top: 10;
			left: 0;
			width: 100%;
			/*         height: 75%;*/
			background-color: var(--paper);
			border: 3px solid purple;
		}

		.menu-closed .site-menu {
			display: none;
		}
	}
</style>
