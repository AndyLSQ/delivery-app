import { ref, reactive, computed, watch } from 'vue';
import { defineStore } from 'pinia';
// import menuData from '../data/menuData.json' assert { type: 'json' };

export const useCartStore = defineStore('cart', function () {
	const items = ref([
		{ name: 'testChalupa', id: 'tb1', price: 4, notes: 'no sour cream', quantity: 1 },
		// { name: 'testGordita', id: 'tb2', price: 4, notes: '', quantity: 1 },
		// { name: 'testGordita', id: 'tb2', price: 4, notes: 'no tomato', quantity: 1 },
	]);

	//

	const count = computed(function () {
		return items.value.length;
	});

	// =================== METHOD 2 ========================

	//check if item is in "items" list
	function alreadyInList(itemFromMenu) {
		return items.value.find(function (itemInCart) {
			console.log('item found in list');
			return itemFromMenu.id == itemInCart.id;
		});
	}

	function add(item) {
		// call check function

		const found = alreadyInList(item);

		//if found, quantity +1
		if (found) {
			found.quantity += 1;
			console.log('alreadyInList: ', alreadyInList(item));
		} else {
			//if not add it to list with quatitiy 1
			item.quantity = 1;
			items.value.push(item);

			console.log('item not found. new item list: ', items.value);
		}
	}

	// =======================================================
	function remove(excludeId) {
		console.log('remove called', excludeId);
		items.value = items.value.filter(function (item) {
			return item.id != excludeId;
		});
	}

	function plusOne(item) {
		item.quantity += 1;
		console.log('add this item +1: ', item);
	}

	function minusOne(item) {
		item.quantity -= 1;
		console.log('add this item -1: ', item);
	}

	watch(items.value, function () {
		items.value.forEach(function (item) {
			let itemSub = item.price * item.quantity;
			item.subtotal = itemSub;
			console.log('check subtotal: ', item);
		});
	});

	const subtotal = computed(function () {
		let sub = 0;
		items.value.forEach(function (item) {
			sub += item.price;
		});

		return sub;
	});

	const quantity = computed(function () {
		let qty = 0;
		items.value.forEach(function (item) {
			qty += item.quantity;
		});

		return qty;
	});

	return {
		items: items,
		count: count,
		add: add,
		remove: remove,
		subtotal: subtotal,
		quantity,
		plusOne,
		minusOne,
		alreadyInList,
		// consolList: consolList,
	};
});
