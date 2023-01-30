<script setup>
	import { ref } from 'vue';
	import { RouterLink, RouterView, useRoute } from 'vue-router';
	import CartView from '@/views/CartView.vue';
	import { useInterfaceStore } from '@/stores/interface';
	import { useLoginStore } from '@/stores/login';
	import { useCartStore } from '@/stores/cart';

	const ui = useInterfaceStore();
	const login = useLoginStore();
	const route = useRoute();
	const cart = useCartStore();

	const sideMenuOpen = ref(false);

	function toggleSideMenu() {
		sideMenuOpen.value = !sideMenuOpen.value;
		console.log(sideMenuOpen.value);
	}
</script>

<template>
	<button @click="ui.toggleMenu()" class="menu-toggle">Toggle menu</button>
	<nav class="site-menu">
		<div class="logo">
			<RouterLink to="/">Food<span>hub</span></RouterLink>
		</div>
		<!-- <RouterLink to="/dashboard">Dashboard</RouterLink> -->
		<RouterLink to="/restaurants">Restaurants</RouterLink>
		<!-- <RouterLink to="/form">Form</RouterLink> -->
		<RouterLink to="/cart">Cart {{ cart.quantity }}</RouterLink>
		<RouterLink to="/account">Account</RouterLink>
		<button @click="toggleSideMenu">side menu</button>
	</nav>
	<button @click="login.toggleLogin()" class="login-toggle">{{ login.loginButton }}</button>

	<div v-if="sideMenuOpen" class="sideCart">
		<button @click="toggleSideMenu">X</button>
		<p>!!!!! LOOK AT ME IM A SIDE MENU</p>
		<CartView />
	</div>
</template>

<style scoped>
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

	.sideCart {
		position: fixed;
		background-color: lightblue;
		top: 0;
		right: 0;
		width: 400px;
		height: 100%;
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

		.sideCart {
			position: fixed;
			background-color: lightblue;
			top: 0;
			right: 0;
			width: 100%;
			height: 100%;
		}
	}
</style>
