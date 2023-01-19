<script setup>
	import { useRoute } from 'vue-router';
	import { useRestaurantStore } from '@/stores/restaurants';

	const route = useRoute();
	const restaurants = useRestaurantStore();

	const restaurant = restaurants.list.find(function (record) {
		return record.slug == route.params.slug;
	});
</script>

<template>
	<div class="about">
		<h1 class="loud-voice">This is a list page</h1>
		<div>
			<ul>
				<li v-for="restaurant in restaurants.list" class="restaurant">
					<RouterLink :to="`/restaurant/${restaurant.slug}`">
						<p>{{ restaurant.name }}</p>
						<p>Price level: {{ restaurant.price }}</p>
					</RouterLink>
				</li>
			</ul>
		</div>
	</div>
</template>

<style>
	.restaurant {
		border: 2px solid red;
	}
</style>
