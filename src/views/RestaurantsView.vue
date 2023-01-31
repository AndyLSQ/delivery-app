<script setup>
	import { computed, ref, onBeforeMount, onMounted } from 'vue';
	import { useRoute } from 'vue-router';
	import { useRestaurantStore } from '@/stores/restaurants';
	import { useFavoritesStore } from '@/stores/favorites';
	import SvgIcons from '@/components/icons/IconTemplate.vue';

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

	const favRestaurants = computed(function () {
		// return 'hi';
		return userRestaurants.value.filter((restaurant) => {
			// console.log(restaurant);
			return restaurant.favorite == true;
		});
	});

	const searchString = ref('');

	const nameFiltered = computed(function () {
		return restaurants.list.filter(function (item) {
			return item.name.toLowerCase().includes(searchString.value.toLowerCase());
		});
	});

	// console.log('test aI', favorites.alreadyIncluded('abc123'));
</script>

<template>
	<div class="rest__detail">
		<!-- {{ userRestaurants }} -->
		<h2 class="loud-voice">Favorites</h2>
		<!-- {{ favRestaurants }} -->
		<!-- <p>{{ favorites.favList }}</p> -->

		<div class="favRestaurants">
			<ul>
				<li class="favPlaceholder" v-if="favRestaurants == ''">A space for all your favorites</li>
				<li v-for="restaurant in favRestaurants" class="restaurant">
					<RouterLink :to="`/restaurant/${restaurant.slug}`">
						<p>{{ restaurant.name }}</p>
						<p>Price level: {{ restaurant.price }}</p>
					</RouterLink>
					<div class="favHeart">
						<SvgIcons
							v-if="restaurant.favorite"
							@click="toggleFav(restaurant.id)"
							class="svg-icon full"
							name="heart-full"
						/><SvgIcons v-else @click="toggleFav(restaurant.id)" class="svg-icon empty" name="heart-empty" />
					</div>
				</li>
			</ul>
			<p>(side scroll this section)</p>
		</div>

		<h1 class="loud-voice">All Restaurants</h1>
		<div class="allRestaurants">
			<!-- <label for="Search">Search</label> -->
			<div class="filter-menu">
				<button>Breakfast</button>
				<button>Lunch</button>
				<button>Dinner</button>
				<p>other ideas: vegan options, fast food, healthy, mexican, asian, pizza, coffee, snacks, desserts</p>
				<p>(side scroll this section)</p>
			</div>
			<!-- <div>
				<input id="search" type="text" v-model="searchString" placeholder="Search restaurants" />
				<ul v-if="searchString != ''">
					<li v-if="nameFiltered == ''" class="noResults">No results found in your area</li>
					<li v-for="item in nameFiltered">{{ item.name }}</li>
				</ul>
			</div> -->
			<p>List:</p>
			<ul>
				<li v-for="restaurant in userRestaurants" class="restaurant">
					<RouterLink :to="`/restaurant/${restaurant.slug}`">
						<p>{{ restaurant.name }}</p>
						<p>Price level: {{ restaurant.price }}</p>
					</RouterLink>
					<div class="favHeart">
						<SvgIcons
							v-if="restaurant.favorite"
							@click="toggleFav(restaurant.id)"
							class="svg-icon full"
							name="heart-full"
						/><SvgIcons v-else @click="toggleFav(restaurant.id)" class="svg-icon empty" name="heart-empty" />
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<style>
	.restaurant {
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
	}
	.svg-icon {
		height: 2.5rem;
		width: 2.5rem;
	}
	.favHeart .empty:hover {
		fill: red;
	}

	.favHeart .full {
		fill: red;
	}

	/*	.favHeart .full:hover {
		fill: black;
	}*/
</style>
