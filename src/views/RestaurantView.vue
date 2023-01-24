<script setup>
	import { useRoute } from 'vue-router';
	import { useRestaurantStore } from '@/stores/restaurants';
	import { useMenuStore } from '@/stores/menu';
	import { useCartStore } from '@/stores/cart';

	const route = useRoute();
	const restaurants = useRestaurantStore();
	const menu = useMenuStore();
	const cart = useCartStore();

	console.log(menu.list);

	console.log('restaurant list value: ', restaurants.list);
	const restaurant = restaurants.list.find(function (record) {
		return record.slug == route.params.slug;
	});

	const currentMenu = menu.list.filter(function (item) {
		return item.restaurantSlug == restaurant.slug;
	});
	// const userRestaurants = []
</script>

<template>
	<!-- {{ route.params.slug }} -->
	<h1 class="loud-voice">{{ restaurant.name }}</h1>
	<button @click="menu.add('hi')">BIG BUTTON</button>

	<h2>Menu</h2>
	{{ currentMenu }}
	<!-- <p>{{ menu.filteredList }}</p> -->
	<ul>
		<div class="card" v-for="item in currentMenu">
			<li>
				{{ item.name }}
			</li>
			<button @click="cart.add(item)">add to cart</button>
		</div>
	</ul>
</template>
