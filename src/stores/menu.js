import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import menuData from '../data/menuData.json' assert { type: 'json' };
import { useRoute } from 'vue-router';
import router from '../router';

// const route = useRoute();

export const useMenuStore = defineStore('menu', function () {
	const list = ref(menuData);

	console.log('List:: ', list);

	const filteredList = computed(function () {
		return list.value.filter(function (item) {
			console.log('listTest slug: ', item.restaurantSlug);

			return item.restaurantSlug == 'chipotle';
		});
	});

	console.log('filteredList:: ', filteredList);

	return {
		list: list,
		filteredList: filteredList,
	};
});
