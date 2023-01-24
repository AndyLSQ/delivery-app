import { ref, reactive, onBeforeMount, onMounted } from 'vue';
import { defineStore } from 'pinia';
import mockData from '../mockData/mockData.json' assert { type: 'json' };
// import { useStorage } from '@vueuse/core';

export const useRestaurantStore = defineStore('restaurants', function () {
	const list = ref(mockData);

	function add(restaurant) {
		list.push(restaurant);
	}

	// function getBySlug(slug) {
	// 	return list.find(function (record) {
	// 		return record.slug == slug;
	// 	});
	// }

	return {
		// getBySlug: getBySlug,
		list: list,
		add: add,
	};
});
