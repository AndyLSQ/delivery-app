import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import menuData from '../data/menuData.json' assert { type: 'json' };
import { useRoute } from 'vue-router';
import router from '../router';

// const route = useRoute();

export const useMenuStore = defineStore('menu', function () {
	const list = ref(menuData);

	// console.log(router.useRoute().params);

	console.log();
	const filteredList = computed(function () {
		// console.log('menu data', menuData);
		// console.log('list data', list.value);

		// menuData.forEach(function (item) {
		// 	// console.log('menuData foreach result: ', item.restaurantId);
		// });

		// list.value.forEach(function (item) {
		// console.log('list.value foreach result: ', item.restaurantId);
		// });

		// const menuDataTest = menuData.filter(function (item) {
		// 	// console.log('menuDataTest item: ', item.restaurantId);
		// 	return item.restaurantId == 'tbell1';
		// });

		// console.log('*** menuData test: ', menuDataTest);

		return list.value.filter(function (item) {
			console.log('listTest slug: ', item.restaurantSlug);

			return item.restaurantSlug == 'chipotle';
		});

		// console.log('***list test: ', listTest);

		// listTest.forEach(function (item) {
		// 	console.log('listTest items: ', item.name);
		// });

		// const test = list.value.filter(function (item) {
		// 	return item.restaurantId == true;
		// });

		// console.log('test: ', test);
	});

	return {
		list: list,
		filteredList: filteredList,
	};
});
