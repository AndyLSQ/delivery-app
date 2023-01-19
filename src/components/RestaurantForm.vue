<script setup>
	import { ref, reactive } from 'vue';
	import { useRestaurantStore } from '@/stores/restaurants';

	const restaurants = useRestaurantStore();

	function save() {
		const record = {
			id: 'dummy-id',
			name: restaurant.name,
			price: restaurant.price,
			slug: 'dummy-slug',
		};
		restaurants.add(record);
		// clear();
		//focusInput();
	}

	const restaurant = reactive({
		id: '',
		name: '',
		price: '',
		slug: '',
	});
</script>

<template>
	<form @submit.prevent="save()">
		<div class="field">
			<label for="n">Restaurant Name</label>
			<input id="n" type="text" v-model="restaurant.name" ref="nameInput" />
		</div>
		<div class="field">
			<label for="p">Price Level (1-5)</label>
			<input id="n" type="number" v-model="restaurant.price" ref="nameInput" min="1" max="5" />
		</div>

		<button type="submit">Submit</button>
	</form>

	<div>
		<ul>
			<li v-for="restaurant in restaurants.list">
				<RouterLink :to="`/restaurant/${restaurant.slug}`">
					{{ restaurant.name }}
				</RouterLink>
			</li>
		</ul>
	</div>
</template>
