<script setup>
	import { ref, computed } from 'vue';
	import { RouterLink, RouterView, useRoute } from 'vue-router';
	import CartView from '@/views/CartView.vue';
	import { useRestaurantStore } from '@/stores/restaurants';
	import { useInterfaceStore } from '@/stores/interface';
	import { useLoginStore } from '@/stores/login';
	import { useCartStore } from '@/stores/cart';
	// import SvgSpriteComponent from '@/components/icons/SvgSprites.vue';
	import SvgIcons from '@/components/icons/IconTemplate.vue';

	const ui = useInterfaceStore();
	const login = useLoginStore();
	const route = useRoute();
	const cart = useCartStore();
	const restaurants = useRestaurantStore();

	const sideMenuOpen = ref(false);

	function toggleSideMenu() {
		sideMenuOpen.value = !sideMenuOpen.value;
		console.log(sideMenuOpen.value);
	}

	const searchString = ref('');

	const filtered = computed(function () {
		return restaurants.list.filter(function (item) {
			return item.name.toLowerCase().includes(searchString.value.toLowerCase());
		});
	});

	function searchClick() {
		searchString.value = '';
		route.go(0);
	}
</script>

<template>
	<button @click="ui.toggleMenu()" class="menu-toggle">Toggle menu</button>
	<nav class="site-menu">
		<div class="logo">
			<RouterLink class="menu-link" to="/">Food<span>hub</span></RouterLink>
		</div>
		<!-- <RouterLink to="/dashboard">Dashboard</RouterLink> -->
		<RouterLink class="menu-link" to="/restaurants">Restaurants</RouterLink>
		<!-- <RouterLink to="/form">Form</RouterLink> -->
		<div>
			<input id="search" type="text" v-model="searchString" placeholder="Search restaurants" />
			<!-- <button type="submit">Go</button> -->
			<!-- <h2>Results for {{ searchString }}</h2> -->
			<ul v-if="searchString != ''">
				<li v-if="filtered == ''" class="noResults">No results found in your area</li>
				<li v-for="item in filtered">
					<RouterLink :to="`/restaurant/${item.slug}`" @click="searchClick">
						{{ item.name }} {{ item.slug }}
					</RouterLink>
				</li>
			</ul>
		</div>
		<RouterLink class="menu-link" to="/account"> <SvgIcons class="svg-icons" name="user" />Sign In</RouterLink>
		<div class="menu-link" @click="toggleSideMenu">
			<SvgIcons class="svg-icons" name="cart" />
			<div class="qBadge">{{ cart.quantity }}</div>
			Cart
		</div>
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
		z-index: 11;
	}

	.menu-link {
		position: relative;
	}

	.qBadge {
		border: 3px solid blue;
		position: absolute;
		top: 0;
		right: 0;
		background-color: red;
		color: white;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.svg-icons {
		border: 3px solid blue;
		width: 3rem;
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
