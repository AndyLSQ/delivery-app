import { ref, reactive, computed } from 'vue';
import { defineStore } from 'pinia';
// import menuData from '../mockData/menuData.json' assert { type: 'json' };

export const useCartStore = defineStore('cart', function () {
	const items = ref([]);

	// function alreadyIncluded(searchId) {
	// 	return favList.value.find(function (itemId) {
	// 		return searchId == itemId;
	// 	});
	// }

	const count = computed(function () {
		return items.value.length;
	});

	function add(item) {
		items.value.push(item);
		console.log(items);
	}

	function remove(excludeId) {
		favList.value = favList.value.filter(function (itemId) {
			return excludeId != itemId;
		});
	}

	return {
		items: items,
		count: count,
		add: add,
		remove: remove,
	};
});
