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

	function clearCart() {
		// let result = window.confirm('pick');
		// console.log(result);

		// if (confirm('pick one') == true) {
		// 	console.log('you picked yes');
		// } else {
		// 	console.log('you picked no');
		// }
		if (window.confirm('Are you sure you want to remove everything from your cart?') == true) {
			items.value = [];
		}
	}

	const count = computed(function () {
		return items.value.length;
	});

	// =================== METHOD 2 ========================

	function searchCart(newItem) {
		return items.value.find(function (itemInCart) {
			return newItem.id == itemInCart.id && newItem.notes == itemInCart.notes;
		});
	}

	function add(item, qty, notes) {
		// create new item object with notes & needed to manually add ID
		const newItem = { ...item, id: item.id, notes: notes };

		// console.log('this item should have ID & quantity & notes added ', newItem);

		const newQty = Number(qty);
		newItem.quantity = newQty;

		// check if this item was found in the list
		const found = searchCart(newItem);

		if (found) {
			console.log('item found in cart');
			found.quantity += newQty;
		} else {
			console.log('item not found in cart');
			items.value.push(newItem);
		}

		// const extPrice = computed(console.log(found.quantity));
	}

	// =======================================================
	function remove(excludeItem) {
		items.value = items.value.filter(function (item) {
			return item.id != excludeItem.id || item.notes != excludeItem.notes;
		});
	}

	function plusOne(item) {
		item.quantity += 1;
		// console.log('add this item +1: ', item);
	}

	function minusOne(item) {
		item.quantity -= 1;
		// console.log('add this item -1: ', item);
	}

	// watch(items.value, function () {
	// 	items.value.forEach(function (item) {
	// 		let itemSub = item.price * item.quantity;
	// 		item.subtotal = itemSub;
	// 		console.log('check subtotal: ', item.subtotal);
	// 	});
	// });

	const allSubtotal = computed(function () {
		let cartSubtotal = 0;
		items.value.forEach(function (item) {
			item.subtotal = item.price * item.quantity;
			cartSubtotal += item.subtotal;
		});
		return cartSubtotal;
	});

	// const subtotal = computed(function () {
	// 	let sub = 0;
	// 	items.value.forEach(function (item) {
	// 		sub += item.price * item.quantity;
	// 	});

	// 	return sub;
	// });

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
		// subtotal: subtotal,
		quantity,
		plusOne,
		minusOne,
		allSubtotal,
		clearCart,
		// alreadyInList,
	};
});
