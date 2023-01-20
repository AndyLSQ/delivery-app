<script setup>
	import { RouterLink, RouterView, useRoute } from 'vue-router';
	import SiteMenu from '@/components/SiteMenu.vue';
	import { useInterfaceStore } from '@/stores/interface';

	const ui = useInterfaceStore();
	const route = useRoute();

	// watch: {
	//    $route(){
	//       // do something
	//    };
	// }
</script>

<template>
	<header v-bind:class="`${route.name} ${ui.menuClass}`">
		<div class="inner-column">
			<SiteMenu />
		</div>
	</header>
	<main class="outlet">
		<div class="inner-column">
			<RouterView />
		</div>
	</main>

	<footer>
		<div class="inner-column">
			<a href="https://github.com/AndyLSQ/delivery-app" target="github">GitHub</a>
		</div>
	</footer>
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
