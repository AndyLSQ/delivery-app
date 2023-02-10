<script setup>
	import { ref, computed } from 'vue';
	import { RouterLink, RouterView, useRoute } from 'vue-router';
	import CartView from '@/views/CartView.vue';

	// Store imports
	import { useRestaurantStore } from '@/stores/restaurants';
	import { useInterfaceStore } from '@/stores/interface';
	import { useLoginStore } from '@/stores/login';
	import { useCartStore } from '@/stores/cart';
	import { userService } from '@/services/userService';

	// Icons
	import SvgIcons from '@/components/icons/IconTemplate.vue';

	// Store constants
	const ui = useInterfaceStore();
	const login = useLoginStore();
	const route = useRoute();
	const cart = useCartStore();
	const restaurants = useRestaurantStore();
	const user = userService();

	const sideMenuOpen = ref(false);

	function toggleSideMenu() {
		sideMenuOpen.value = !sideMenuOpen.value;
		console.log(sideMenuOpen.value);
	}

	const searchString = ref('');

	const nameFiltered = computed(function () {
		return restaurants.list.filter(function (item) {
			return item.name.toLowerCase().includes(searchString.value.toLowerCase());
		});
	});

	function searchClick() {
		searchString.value = '';
	}

	document.addEventListener('keydown', (e) => {
		if (sideMenuOpen && e.keyCode == 27) {
			sideMenuOpen.value = false;
		}
	});
</script>

<template>
	<button @click="ui.toggleMenu()" class="menu-toggle">Toggle menu</button>
	<nav class="site-menu">
		<div class="logo">
			<RouterLink class="menu-link" to="/">Food<span>hub</span></RouterLink>
		</div>

		<!-- SEARCH BAR -->
		<div class="searchBarContain">
			<input
				id="searchBar"
				type="text"
				v-model="searchString"
				placeholder="Search restaurants"
			/>
			<!-- <button type="submit">Go</button> -->
			<!-- <h2>Results for {{ searchString }}</h2> -->
			<ul class="searchResults" v-if="searchString != ''">
				<li v-if="nameFiltered == ''" class="noResults">No results found in your area</li>
				<li v-for="item in nameFiltered" :key="`/restaurant/${item.slug}`">
					<!-- use key to diff -->
					<RouterLink :to="`/restaurant/${item.slug}`" @click="searchClick">
						{{ item.name }}
					</RouterLink>
				</li>
			</ul>
		</div>

		<div class="icon-nav">
			<!-- ACCOUNT -->
			<!-- ========= BELOW is actual router link to acct page ========= -->
			<!-- 	<RouterLink to="/account" v-if="user.currentFB" class="icon-link signIn-link">
				<SvgIcons class="svg-icons" name="user" />
				<p class="quiet-voice">Account</p>
			</RouterLink> -->
			<!-- ========= BELOW is dummy setup for now that just opens modal========= -->
			<div v-if="user.currentFB" class="icon-link signIn-link" @click="user.openModal()">
				<SvgIcons class="svg-icons" name="user" />
				<p class="quiet-voice">Account</p>
			</div>
			<!-- SIGN IN -->
			<div v-else class="icon-link signIn-link" @click="user.openModal()">
				<SvgIcons class="svg-icons" name="sign-in" />
				<p class="quiet-voice">Sign in</p>
			</div>

			<!-- CART -->
			<div class="icon-link cart-link" @click="toggleSideMenu">
				<SvgIcons class="svg-icons" name="cart" />
				<div v-if="cart.quantity > 0" class="qBadge">{{ cart.quantity }}</div>
				<p class="quiet-voice">Cart</p>
			</div>
		</div>
	</nav>
	<!-- Old login toggle -->
	<!-- <button @click="login.toggleLogin()" class="login-toggle">{{ login.loginButton }}</button> -->

	<!-- CART VIEW -->
	<Transition name="slideOut">
		<div v-if="sideMenuOpen" class="sideCartModal" @click="toggleSideMenu()">
			<div class="sideCartDialogue" @click.stop>
				<button @click="toggleSideMenu">X</button>
				<CartView />
			</div>
		</div>
	</Transition>
</template>

<style scoped>
	.site-menu {
		display: flex;
		flex-direction: row;
		align-items: center;
		/*		flex-wrap: wrap;*/
		justify-content: space-between;
	}

	.logo {
		display: grid;
		place-items: center;
	}

	.searchBarContain {
		position: relative;
		border: 1px solid red;
		width: 50%;
		display: grid;
		place-items: center;
	}

	#searchBar {
		width: 100%;
		border: 2px solid green;
		padding: 1rem;
	}

	.searchResults {
		position: absolute;
		top: 100%;
		width: 100%;
		background-color: lightgreen;
	}

	.icon-nav {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
		font-size: 0.75rem;
		/*		border: 3px solid red;*/
	}

	.icon-link {
		display: grid;
		place-items: center;
	}

	.menu .router-link-active {
		border-bottom: 3px solid red;
	}

	/*middle*/

	.slideOut-enter-active,
	.slideOut-leave-active {
		transition: background-color 0.3s ease-in-out;
	}

	/*start & end*/
	.slideOut-enter-from .slideOut,
	.slideOut-leave-to .slideOut {
		opacity: 0;
	}

	.slideOut-enter-active .sideCartDialogue,
	.slideOut-leave-active .sideCartDialogue {
		transform: translateX(0%);
		transition: transform 0.3s;
	}

	/*start & end*/
	.slideOut-enter-from .sideCartDialogue,
	.slideOut-leave-to .sideCartDialogue {
		transform: translateX(100%);
		/*		background-color: red;*/
	}

	.sideCartModal {
		background-color: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 12;
	}

	.sideCartDialogue {
		position: fixed;
		background-color: lightblue;
		top: 0;
		right: 0;
		width: 400px;
		height: 100%;
		z-index: 11;
	}

	.cart-link {
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
		width: 2.5rem;
		height: 2.5rem;
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
