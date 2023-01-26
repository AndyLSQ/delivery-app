<script setup>
	import { ref, reactive, computed, watch } from 'vue';
	import { useRoute } from 'vue-router';
	import { useRestaurantStore } from '@/stores/restaurants';
	import { useMenuStore } from '@/stores/menu';
	import { useCartStore } from '@/stores/cart';
	import DishView from './DishView.vue';

	const route = useRoute();
	const restaurants = useRestaurantStore();
	const menu = useMenuStore();
	const cart = useCartStore();

	// console.log(menu.list);

	// console.log('restaurant list value: ', restaurants.list);
	const restaurant = restaurants.list.find(function (record) {
		return record.slug == route.params.slug;
	});

	const currentMenu = menu.list.filter(function (item) {
		return item.restaurantSlug == restaurant.slug;
	});
	// const userRestaurants = []

	const modalOpen = ref(false);
	const modalItem = ref(null);

	function openDishView(item) {
		modalOpen.value = true;
		modalItem.value = item;
	}
	function closeModal() {
		modalOpen.value = false;
		modalItem.value = null;
	}
</script>

<template>
	<!-- {{ route.params.slug }} -->
	<h1 class="loud-voice">{{ restaurant.name }}</h1>
	<!-- <button @click="menu.add('hi')">BIG BUTTON</button> -->

	<h2>Menu</h2>
	<!-- {{ currentMenu }} -->
	<!-- <p>{{ menu.filteredList }}</p> -->
	<ul>
		<div class="card" v-for="item in currentMenu">
			<li>
				{{ item.name }}
			</li>

			<button @click="openDishView(item)">Add</button>

			<!-- <div>QUANTITY: {{ cart.fetchQuantity(item) }}</div> -->
			<button v-if="cart.alreadyInList(item)" @click="cart.minusOne(item)">qty minus one</button>
			<!-- <div v-if="cart.alreadyInList(item)">{{ cart.fetchQuantity(item) }}</div> -->
			<button v-if="cart.alreadyInList(item)" @click="cart.plusOne(item)">qty plus one</button>
			<button v-else @click="cart.add(item)">add to cart</button>
		</div>
	</ul>

	<Transition>
		<div class="modal" v-if="modalOpen">
			<div class="dialogue">
				<button @click="closeModal()">Close</button>
				<h2 class="loud-voice">{{ modalItem.name }}</h2>
				<p>[Item image]</p>
				<p>[Item description]</p>
				<form action="">
					<label for="cartNote">Special Requests</label>
					<input id="cartNote" type="text" />
					<label for="quantity">Quantity</label>
					<input id="quantity" type="number" min="1" max="99" value="1" />
					<button>Add to cart</button>
				</form>
			</div>
		</div>
	</Transition>

	<div class="contain">
		<h1 class="loud-voice">cart preview</h1>
	</div>
	{{ cart.items }}
</template>

<style scoped>
	.modal {
		background-color: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		/*		align-items: center;*/
		/*		justify-content: center;*/
	}

	.dialogue {
		background-color: white;
	}

	/*middle*/
	.v-enter-active,
	.v-leave-active {
		transition: 2.3s ease-in-out;
	}

	/*start & end*/
	.v-enter-from,
	.v-leave-to {
		opacity: 0;
	}

	:is(.v-enter-from, .v-enter-to) .dialogue {
		transition: 2.3s ease-in-out;
	}

	:is(.v-enter-from, .v-enter-to) .dialogue {
		transform: translate(-100%);
	}
</style>
