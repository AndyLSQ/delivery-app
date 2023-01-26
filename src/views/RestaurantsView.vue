<script setup>
	import { computed, onBeforeMount, onMounted } from 'vue';
	import { useRoute } from 'vue-router';
	import { useRestaurantStore } from '@/stores/restaurants';
	import { useFavoritesStore } from '@/stores/favorites';

	const route = useRoute();
	const restaurants = useRestaurantStore();
	const favorites = useFavoritesStore();

	function toggleFav(restaurantId) {
		console.log('saving favorite');
		favorites.toggleFavorite(restaurantId);
	}

	const restaurant = restaurants.list.find(function (record) {
		return record.slug == route.params.slug;
	});

	//create computed property
	const userRestaurants = computed(function () {
		//Look over full restaurant list (look at each restaurant)
		const userRestaurantsArray = [];

		restaurants.list.forEach(function (restaurant) {
			//If ID is in the favorites list,
			if (favorites.favList.includes(restaurant.id)) {
				//Give it a favorite boolean
				restaurant.favorite = true;
			} else {
				restaurant.favorite = false;
			}
			userRestaurantsArray.push(restaurant);
		});

		//Return a new array (add an addtl property to each item)
		return userRestaurantsArray;
	});

	// console.log('test aI', favorites.alreadyIncluded('abc123'));
</script>

<template>
	<div class="rest__detail">
		<!-- {{ userRestaurants }} -->
		<h1 class="loud-voice">This is a list page</h1>
		<div>
			<ul>
				<li v-for="restaurant in userRestaurants" class="restaurant">
					<p>{{ restaurant.name }}</p>
					<p>Price level: {{ restaurant.price }}</p>
					<!-- TODO: doesnt have to be 2 separate buttons could be 2 separate spans in the same button -->
					<button v-if="restaurant.favorite" @click="toggleFav(restaurant.id)">Remove from favorites</button>
					<button v-else @click="toggleFav(restaurant.id)">Add to favorites</button>
					<RouterLink :to="`/restaurant/${restaurant.slug}`"> Select Restaurant </RouterLink>
				</li>
			</ul>

			<h2>Favorites</h2>
			<p>{{ favorites.favList }}</p>
		</div>
	</div>
</template>

<style>
	.restaurant {
		border: 2px solid red;
	}
</style>
