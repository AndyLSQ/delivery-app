import { ref, reactive, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', function () {
	const items = ref([]);

	//
	const count = computed(function () {
		return items.value.length;
	});

	const quantity = computed(function () {
		let qty = 0;
		items.value.forEach(function (item) {
			qty += item.quantity;
		});

		return qty;
	});

	// =================== METHOD 2 ========================

	function searchCart(newItem) {
		return items.value.find(function (itemInCart) {
			return newItem.id == itemInCart.id && newItem.notes == itemInCart.notes;
		});
	}

	function add(item, qty, notes) {
		const newItem = { ...item, id: item.id, notes: notes };

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
	}

	function remove(excludeItem) {
		items.value = items.value.filter(function (item) {
			return item.id != excludeItem.id || item.notes != excludeItem.notes;
		});
	}

	function plusOne(item) {
		item.quantity += 1;
	}

	function minusOne(item) {
		item.quantity -= 1;
	}

	function clearCart() {
		if (window.confirm('Are you sure you want to remove everything from your cart?') == true) {
			items.value = [];
		}
	}

	const allSubtotal = computed(function () {
		let cartSubtotal = 0;
		items.value.forEach(function (item) {
			item.subtotal = item.price * item.quantity;
			cartSubtotal += item.subtotal;
		});
		return cartSubtotal;
	});

	return {
		items,
		count,
		add,
		remove: remove,
		quantity,
		plusOne,
		minusOne,
		allSubtotal,
		clearCart,
	};
});
