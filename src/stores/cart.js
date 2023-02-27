import { ref, reactive, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useFirestore, useCollection } from 'vuefire';
import { collection, doc, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { userService } from '@/services/userService';

export const useCartStore = defineStore('cart', function () {
	const items = ref([]);
	const user = userService();

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

	// =================== New Pseudocode ========================
	// == Setup
	// Pull cart DB
	const db = useFirestore();
	const cartDb = useCollection(collection(db, 'cart'));
	// Set constants - LS cart list
	const localCartList = ref(window.localStorage.getItem('cartList'));

	// ==== ADD ITEMS TO CART function: ====
	function findRestaurantCart() {
		const foundCart = localCartList.value.find(
			(localCart) => localCart.restaurantId == restaurantId,
		);
		console.log('foundCart: ', foundCart);
		return foundCart;
	}

	async function createCart(userId, restaurantId) {
		const newCart = await addDoc(collection(db, 'cart'), {
			userId,
			restaurantId,
			items: [],
		});
		console.log('New document written with ID: ', newCart.id);
	}

	function addCartToLs() {}

	function addToCart(restaurantId) {
		console.log('restaurantId: ', restaurantId);
		// == A. If logged out
		if (!user.authUser) {
			// 1. check if any carts in local storage cart list
			if (localCartList.value) {
				console.log('yes cart list. ', localCartList.value);
				// 2. loop thru carts in LS, check each for restaurant ID match
				if (findRestaurantCart()) {
					console.log('foundCart: ', foundCart);
					// do something with the foundCart (reduce & add new item to it)
				}

				// 2a. if no match, create a new cart,
				// add item, & assign cartId to local storage
			} else {
				console.log('no cart list. ', localCartList.value);
				// 3. if no carts in LS, create a new cart
				createCart('anonymous', restaurantId);
				// add item, & assign cartId to local storage
			}
		}
	}

	function setLocalCartList() {
		window.localStorage.setItem('cartList', ['###CurrentCartId']);
		setWelcome();
	}
	// 3b. if match, REDUCE & add item to cart (maybe make reduce a separate function?)
	// 4. write cart to db

	// == B. If logged in
	// 1. check user doc for carts
	// 2. if no carts, skip to 3a
	// 3. if any, check if restaurantId matches current restaurant
	// 3a. if not, create new cart, add item
	// 3b. if so, REDUCE and add item to cart
	// 4. write cart to db

	// ==== RENDERING ====
	// == A. If logged out
	// 1. check if any carts in local storage cart list
	// 2. if so, render them
	// == B. If logged in
	// 1. Check user doc for carts
	// 2. if so, render them

	// ============= Original ====================
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
		addToCart,
	};
});
