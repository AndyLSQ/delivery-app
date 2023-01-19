import { reactive } from 'vue';
import { defineStore } from 'pinia';
// import { useStorage } from '@vueuse/core';

export const useRestaurantStore = defineStore('restaurants', function () {
	const list = reactive([
		{
			id: 'abc123',
			name: 'Taco Bell',
			price: 1,
			slug: 'taco-bell',
		},
		{
			id: 'def456',
			name: 'Chipotle',
			price: 2,
			slug: 'chipotle',
		},
	]);

	function add(restaurant) {
		list.push(restaurant);
	}

	return {
		list: list,
		add: add,
	};
});
