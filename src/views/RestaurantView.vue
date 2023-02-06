<script setup>
	import { ref, computed, watch, nextTick } from 'vue';
	import { useRoute } from 'vue-router';
	import { useRestaurantStore } from '@/stores/restaurants';
	import { useMenuStore } from '@/stores/menu';
	import { useCartStore } from '@/stores/cart';
	// import DishView from './DishView.vue';
	import MenuList from '@/components/MenuList.vue';

	const route = useRoute();
	const restaurants = useRestaurantStore();
	const menu = useMenuStore();
	const cart = useCartStore();

	// Use computed so the route updates with any change in the url (for search)

	// console.log(route.params.slug);

	const restaurant = computed(function () {
		return restaurants.list.find(function (record) {
			// console.log('1. slug from restaurants list: ', record.slug);
			return record.slug == route.params.slug;
		});
	});

	// console.log('2. restaurant: ', restaurant);

	const currentMenu = menu.list.filter(function (item) {
		// console.log('3. item from menu list', item);
		// console.log('3a. item.restaurantSlug', item.restaurantSlug);
		// console.log('3a. restaurant.value.slug', restaurant.value.slug);
		return item.restaurantSlug == restaurant.value.slug;
	});

	// console.log('4. currentMenu', currentMenu);
	// const userRestaurants = []

	// console.log(menu);

	const modalOpen = ref(false);
	const modalItem = ref(null);

	function openDishView(item) {
		modalOpen.value = true;
		modalItem.value = item;
	}
	function closeModal() {
		modalOpen.value = false;
		modalItem.value = null;
		clearForm();
	}

	function clearForm() {
		notes.value = '';
		qty.value = 1;
	}

	document.addEventListener('keydown', (e) => {
		if (modalOpen && e.keyCode == 27) {
			closeModal();
		}
	});

	// watch(modalOpen, function (newState, oldState) {
	// 	nextTick(function () {
	// 		const firstField = ref(null); // this is like a doc obj
	// 		console.log('first field', firstField);
	// 		firstField.value.focus();
	// 		// console.log('modalItem: ', item);
	// 	});
	// });

	const qty = ref(1);
	const notes = ref('');
</script>

<template>
	<MenuList />
	<!--	<h1 class="loud-voice">{{ restaurant.name }}</h1>

	<h2>Menu</h2>
	<ul>
		<div class="card" v-for="item in currentMenu">
			<li>
				{{ item.name }}
			</li>

			<button @click="openDishView(item)">Add</button>
		</div>
	</ul> -->

	<!-- Add-to-cart modal -->
	<!-- 	<Transition>
		<div class="modal" v-if="modalOpen" @click="closeModal()">
			<div class="dialogue" @click.stop>
				<button @click.prevent="closeModal()">Close</button>
				<h2 class="loud-voice">{{ modalItem.name }}</h2>
				<p>[Item image]</p>
				<p>[Item description]</p>
				<p>whole item {{ modalItem }}</p>
				<form action="">
					<label for="cartNote">Special Requests</label>
					<input id="cartNote" type="text" v-model="notes" />
					<label for="quantity">Quantity</label>
					<input id="quantity" type="number" min="1" max="99" v-model="qty" ref="firstField" />

					<button
						@click.prevent="
							cart.add(modalItem, qty, notes);
							closeModal();
						"
					>
						Add to cart
					</button>
				</form>
			</div>
		</div>
	</Transition> -->

	<!-- <div class="contain">
		<h1 class="loud-voice">cart preview</h1>
	</div>
	<pre>
		<code>
	{{ cart.items }}
		</code>
	</pre> -->
</template>

<style scoped></style>
