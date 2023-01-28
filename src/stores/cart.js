import { ref, reactive, computed, watch } from 'vue';
import { defineStore } from 'pinia';
// import menuData from '../data/menuData.json' assert { type: 'json' };

export const useCartStore = defineStore('cart', function () {
	const items = ref([
		// { name: 'testChalupa', id: 'tb1', price: 4, notes: 'a', quantity: 1 },
		// { name: 'testGordita', id: 'tb2', price: 4, notes: '', quantity: 1 },
		// { name: 'testGordita', id: 'tb2', price: 4, notes: 'no tomato', quantity: 1 },
	]);

	//

	const count = computed(function () {
		return items.value.length;
	});

	// =================== METHOD 2 ========================

	//check if item is in "items" list
	// function alreadyInList(itemFromMenu) {
	// 	return items.value.find(function (itemInCart) {
	// 		console.log(
	// 			'alreadyInList retuns: ',
	// 			itemFromMenu.id == itemInCart.id && itemFromMenu.notes == itemInCart.notes,
	// 		);
	// 		return itemFromMenu.id == itemInCart.id && itemFromMenu.notes == itemInCart.notes;
	// 	});
	// }

	function searchCart(newItem) {
		// console.log('new item in SEARCHCART: ', newItem);
		return items.value.find(function (itemInCart) {
			return newItem.id == itemInCart.id && newItem.notes == itemInCart.notes;
		});
	}

	function add(item, qty, notes) {
		// create new item object with notes
		const newItem = { ...item, notes: notes };

		// console.log('this item should have notes added ', item);

		const newQty = Number(qty);
		newItem.quantity = newQty;

		// check if this item was found in the list
		const found = searchCart(newItem);
		// const foundItem = searchCart(newItem);

		if (found) {
			console.log('item found in list');
			found.quantity += newQty;
		} else {
			console.log('item not found in list');
			items.value.push(newItem);
		}

		// items.value.push(newItem);
		// console.log('!! itemst list now: ', items);

		// const found = alreadyInList(item);

		//if found, quantity +1
		// if (found) {
		// 	found.quantity += newQty;
		// 	console.log('alreadyInList: ', alreadyInList(item, notes));
		// } else {
		// 	//if not add it to list with quantitiy 1
		// 	item.quantity = newQty;
		// 	items.value.push(item);
		// 	console.log('item not found. new item list: ');
		// }
	}

	//  ********

	// function inList(itemFromMenu) {
	// 	console.log('in list running');

	// 	return items.value.find(function (itemInCart) {
	// 		console.log('itemFromMenu notes', itemFromMenu.notes);
	// 		console.log('itemInCart notes', itemInCart.notes);
	// 		// console.log('itemFromMenu id', itemFromMenu.id);
	// 		// console.log('itemInCart id', itemInCart.id);
	// 		return itemFromMenu.notes == itemInCart.notes;
	// 	});
	// }

	// function tfTest(newItem) {}

	// function add2(item, singleNote, addQuantity) {
	// 	item.notes = singleNote;
	// 	console.log('item with notes added: ', item);
	// 	const found = inList(item);
	// 	console.log('found: ', found);

	// 	if (!inList(item)) {
	// 		console.log('item not found');
	// 		item.quantity = addQuantity;
	// 		items.value.push(item);
	// 	} else {
	// 		console.log('item found');
	// 		found.quantity += addQuantity;
	// 	}

	// if (inList(item)) {
	// 	console.log('item found');
	// 	found.quantity += addQuantity;
	// } else {
	// 	console.log('item not found');
	// 	item.quantity = addQuantity;
	// 	items.value.push(item);
	// }
	// }
	//  ********

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

	// watch(items.value, function () {
	// 	items.value.forEach(function (item) {
	// 		let itemSub = item.price * item.quantity;
	// 		item.subtotal = itemSub;
	// 		console.log('check subtotal: ', item);
	// 	});
	// });

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
		// add2,
		remove: remove,
		subtotal: subtotal,
		quantity,
		plusOne,
		minusOne,
		// alreadyInList,
	};
});
