<script setup>
	import { ref, reactive, computed, onMounted } from 'vue';
	import { useFirestore, useCollection } from 'vuefire';
	import { collection, doc, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
	import { useFavoritesStore } from '@/stores/favorites';

	import SvgIcons from '@/components/icons/IconTemplate.vue';

	const db = useFirestore();

	const restaurants = useCollection(collection(db, 'restaurants'));
	const favorites = useFavoritesStore();

	function toggleFav(restaurantId) {
		console.log('saving favorite');
		favorites.toggleFavorite(restaurantId);
	}

	const userRestaurants = computed(function () {
		const userRestaurantsArray = [];
		restaurants.value.forEach(function (restaurant) {
			// return console.log('rest COMP', restaurant);
			if (favorites.favList.includes(restaurant.id)) {
				//Give it a favorite boolean
				restaurant.favorite = true;
			} else {
				restaurant.favorite = false;
			}
			userRestaurantsArray.push(restaurant);
		});
		return userRestaurantsArray;
	});
</script>

<template>
	<h2 class="voice2">Restaurant List</h2>
	<ul>
		<!-- 		{{
			userRestaurants
		}} -->
		<li class="restaurant-card" v-for="restaurant in userRestaurants">
			<RouterLink :to="`/restaurant/${restaurant.id}`">
				<picture>[ restaurant image ]</picture>
				{{ restaurant.name }}
			</RouterLink>
			<div class="favHeart">
				<SvgIcons
					v-if="restaurant.favorite"
					@click="toggleFav(restaurant.id)"
					class="svg-icon full"
					name="heart-full"
				/><SvgIcons
					v-else
					@click="toggleFav(restaurant.id)"
					class="svg-icon empty"
					name="heart-empty"
				/>
			</div>
		</li>
	</ul>
</template>

<style scoped>
	.restaurant-card {
		border: 2px solid red;
		position: relative;
	}
	.favHeart {
		z-index: 10;
		width: 3rem;
		position: absolute;
		top: 0;
		right: 0;
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.svg-icon {
		height: 1.5rem;
		width: 1.5rem;
	}
	.favHeart .empty:hover {
		fill: red;
	}

	.favHeart .full {
		fill: red;
	}
</style>
