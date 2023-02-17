<script setup>
	import { RouterLink, RouterView, useRoute } from 'vue-router';
</script>

<template>
	<nav>
		<ul>
			<!-- <RouterLink to="restaurant/chipotle">chipotle</RouterLink> -->
			<li><RouterLink to="/account/">Profile</RouterLink></li>
			<li><RouterLink to="/account/address">Address</RouterLink></li>
			<li><RouterLink to="/account/billing">Billing</RouterLink></li>
			<li><RouterLink to="/account/favorites">Favorites</RouterLink></li>
		</ul>
	</nav>
</template>

<style scoped>
	nav {
		display: grid;
		place-items: center;
	}
	ul {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}
	a {
		border: 1px solid black;
		padding: 2px 20px;
	}
	.router-link-active {
		color: white;
		background-color: black;
		/*		border-bottom: 3px solid red;*/
	}
</style>
