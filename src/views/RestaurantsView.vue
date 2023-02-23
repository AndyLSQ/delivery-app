<script setup>
	import { computed, ref, onBeforeMount, onMounted } from 'vue';
	import { useRoute } from 'vue-router';
	import { useRestaurantStore } from '@/stores/restaurants';
	import { useFavoritesStore } from '@/stores/favorites';
	import SvgIcons from '@/components/icons/IconTemplate.vue';
	import RestaurantList from '@/components/RestaurantList.vue';

	const route = useRoute();
	const restaurants = useRestaurantStore();
	const favorites = useFavoritesStore();

	const restaurant = restaurants.list.find(function (record) {
		return record.slug == route.params.slug;
	});

	const favRestaurants = computed(function () {
		return userRestaurants.value.filter((restaurant) => {
			return restaurant.favorite == true;
		});
	});

	const searchString = ref('');

	const nameFiltered = computed(function () {
		return restaurants.list.filter(function (item) {
			return item.name.toLowerCase().includes(searchString.value.toLowerCase());
		});
	});

	const filterString = ref('');

	const typeFiltered = computed(function () {
		return restaurants.list.filter(function (item) {
			return item.type.toLowerCase().includes(filterString.value.toLowerCase());
		});
	});
</script>

<template>
	<div class="section filters">
		<div class="headline">
			<div class="eyebrow">Choose your craving</div>
			<h2 class="voice2">Filter by Type</h2>
		</div>
		<ul class="filter-list">
			<li class="filter-selector">
				<picture class="filter-icon">
					<img
						src="@/components/icons/food-icons/asian.svg"
						alt=""
					/>
				</picture>
				<div class="cat-label quiet-voice">Asian</div>
			</li>
			<li class="filter-selector">
				<picture class="filter-icon">
					<img
						src="@/components/icons/food-icons/mexican.svg"
						alt=""
					/>
				</picture>
				<div class="cat-label quiet-voice">Mexican</div>
			</li>
			<li class="filter-selector">
				<picture class="filter-icon">
					<img
						src="@/components/icons/food-icons/pizza.svg"
						alt=""
					/>
				</picture>
				<div class="cat-label quiet-voice">Pizza</div>
			</li>
			<li class="filter-selector">
				<picture class="filter-icon">
					<img
						src="@/components/icons/food-icons/burgers.svg"
						alt=""
					/>
				</picture>
				<div class="cat-label quiet-voice">Burgers</div>
			</li>
			<li class="filter-selector">
				<picture class="filter-icon">
					<img
						src="@/components/icons/food-icons/chicken.svg"
						alt=""
					/>
				</picture>
				<div class="cat-label quiet-voice">Chicken</div>
			</li>
			<li class="filter-selector">
				<picture class="filter-icon">
					<img
						src="@/components/icons/food-icons/fast-food.svg"
						alt=""
					/>
				</picture>
				<div class="cat-label quiet-voice">Fast-Food</div>
			</li>
			<li class="filter-selector">
				<picture class="filter-icon">
					<img
						src="@/components/icons/food-icons/healthy.svg"
						alt=""
					/>
				</picture>
				<div class="cat-label quiet-voice">Healthy</div>
			</li>
			<li class="filter-selector">
				<picture class="filter-icon">
					<img
						src="@/components/icons/food-icons/dessert.svg"
						alt=""
					/>
				</picture>
				<div class="cat-label quiet-voice">Dessert</div>
			</li>
			<li class="filter-selector">
				<picture class="filter-icon">
					<img
						src="@/components/icons/food-icons/sushi.svg"
						alt=""
					/>
				</picture>
				<div class="cat-label quiet-voice">Sushi</div>
			</li>
			<li class="filter-selector">
				<picture class="filter-icon">
					<img
						src="@/components/icons/food-icons/chinese.svg"
						alt=""
					/>
				</picture>
				<div class="cat-label quiet-voice">Chinese</div>
			</li>
			<li class="filter-selector">
				<picture class="filter-icon">
					<img
						src="@/components/icons/food-icons/mediterranean.svg"
						alt=""
					/>
				</picture>
				<div class="cat-label quiet-voice">Mediterranean</div>
			</li>
			<li class="filter-selector">
				<picture class="filter-icon">
					<img
						src="@/components/icons/food-icons/vegan.svg"
						alt=""
					/>
				</picture>
				<div class="cat-label quiet-voice">Vegan</div>
			</li>
			<li class="filter-selector">
				<picture class="filter-icon">
					<img
						src="@/components/icons/food-icons/vegetarian.svg"
						alt=""
					/>
				</picture>
				<div class="cat-label quiet-voice">Vegetarian</div>
			</li>
			<li class="filter-selector">
				<picture class="filter-icon">
					<img
						src="@/components/icons/food-icons/breakfast.svg"
						alt=""
					/>
				</picture>
				<div class="cat-label quiet-voice">Breakfast</div>
			</li>
			<li class="filter-selector">
				<picture class="filter-icon">
					<img
						src="@/components/icons/food-icons/indian.svg"
						alt=""
					/>
				</picture>
				<div class="cat-label quiet-voice">Indian</div>
			</li>
		</ul>
	</div>
	<RestaurantList />
</template>

<style scoped>
	/* ==== FAVORITE ==== */
	.restaurant {
		border: 2px solid red;
		position: relative;
	}
	/*	.favHeart {
		z-index: 10;
		width: 3rem;
		position: absolute;
		top: 0;
		right: 0;
		padding: 0;
		background-color: white;
		display: flex;
		justify-content: center;
		align-items: center;
	}*/
	.svg-icon {
		/*		height: 1.5rem;*/
		/*		width: 1.5rem;*/
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

	/* ==== FILTERS ==== */

	.filter-list {
		padding: 5px 0px;
	}

	.filter-selector {
		border: 2px solid var(--paper-color);
		background-color: var(--paper-color);
		border-radius: 20px;
		padding: 15px;
		width: 95px;
		display: flex;
		flex-direction: column;
		gap: 5px;
		align-items: center;
		justify-content: space-between;
		box-shadow: var(--shadow-subtle);
		transition: 0.3s ease-in-out;
	}

	.filter-selector:hover {
		border: 2px solid var(--highlight);
		cursor: pointer;
		transition: 0.3s ease-in-out;
	}
	.filter-selector picture {
		/*		border: 1px solid red;*/
		padding: 5px;
		width: 100%;
	}
	.filter-icon {
		width: 100%;
	}

	.filter-list {
		display: grid;
		grid-auto-flow: column;
		grid-template-rows: repeat(1, 1fr);
		/*		flex-direction: row;*/
		gap: 25px;
		overflow: scroll;
	}
</style>
