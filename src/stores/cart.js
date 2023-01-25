import { ref, reactive, computed } from 'vue';
import { defineStore } from 'pinia';
// import menuData from '../mockData/menuData.json' assert { type: 'json' };

export const useCartStore = defineStore('cart', function () {
	const items = ref([
		{ name: 'testChalupa', id: 'tb1', price: 5, notes: 'no sour cream' },
		{ name: 'testGordita', id: 'tb2', price: 4, notes: '' },
		{ name: 'testGordita', id: 'tb2', price: 4, notes: 'no tomato', quantity: 1 },
	]);

	// function alreadyIncluded(searchId) {
	// 	return favList.value.find(function (itemId) {
	// 		return searchId == itemId;
	// 	});
	// }

	//objective

	//write up pseudocode first
	// Create consolidated list as computed function
	const consolList = computed(function () {
		// Create new array for consolidated list
		const fullArray = items.value;

		console.log(fullArray);

		// var found = fullArray.find(function (item) {
		// 	return item.id == 'tb2';
		// });

		var foundIndex = fullArray.findIndex(function (item) {
			return item.id == 'tb2' && item.notes == 'no tomato';
		});

		console.log('found index: ', foundIndex);

		console.log('found object: ', fullArray[foundIndex]);

		fullArray[foundIndex].quantity += 1;

		console.log('add quantity: ', fullArray[foundIndex]);

		const consolArray = ['hi'];

		// const inList = items.value.find(function (item) {
		// 	item.id == 'tb2';
		// });

		// Loop through each item from the items list
		// const test = items.value.forEach(function (item) {
		// 	consolArray.push(item.id);
		// 	consolArray.push(inList);
		// 	console.log('inList', inList);
		// // If the item is already in the list*, add 1 to the quantity
		// });

		// const test = items.value.find(function (item) {
		// 	item.id = 'tb2';
		// });

		// items.value.forEach(function (item) {

		// 	consolArray.push(item);

		// 	})
		// });
		// if ((item.id = 'tb1')) {
		// console.log('already in list: ', item);
		// 	item.quantity += 1;
		// }
		// * if item is not in the list, add it with quantity 1
		// else {
		// console.log('Not yet in list: ', item);
		// consolArray.push(item);
		// item.quantity = 1;
		// }
		// });
		return consolArray;
	});

	const count = computed(function () {
		return items.value.length;
	});

	function add(item) {
		items.value.push(item);
		console.log(items);
	}

	function remove(excludeId) {
		console.log('remove called', excludeId);
		items.value = items.value.filter(function (item) {
			return item.id != excludeId;
		});
	}

	const subtotal = computed(function () {
		let sub = 0;
		items.value.forEach(function (item) {
			sub += item.price;
		});

		return sub;
	});

	return {
		items: items,
		count: count,
		add: add,
		remove: remove,
		subtotal: subtotal,
		consolList: consolList,
	};
});
