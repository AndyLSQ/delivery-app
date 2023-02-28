import { ref, reactive, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useFirestore, useCollection, useDocument } from 'vuefire';
import { collection, doc, getDoc, addDoc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';
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
	const cartDb = useCollection(collection(db, 'carts'));
	// Set constants - LS cart list
	const localCartList = ref(window.localStorage.getItem('cartList'));

	// ==== ADD ITEMS TO CART function: ====
	async function findRestaurantCart(currentRestaurantId) {
		let localCarts = JSON.parse(window.localStorage.getItem('cartList'));
		let cartData = '';
		let match = false;
		console.log('localCarts: ', localCarts);
		// const dbCartMatchId =
		await localCarts.forEach(async function (localCartId) {
			const docSnap = await getDoc(doc(db, 'carts', localCartId));
			cartData = await docSnap.data();
			console.log('cartData: ', cartData);
			// console.log('cartData.restaurantId', cartData.restaurantId);
			console.log('currentRestaurantId', currentRestaurantId);
			// return cartData.restaurantId == currentRestaurantId;

			if ((await cartData.restaurantId) == currentRestaurantId) {
				await console.log('MATCH FOUND');
				match = true;
			} else {
				await console.log('MATCH NOT FOUND');
			}
		});

		return match;

		// console.log('dbCartMatchId: ', dbCartMatchId);

		// return dbCartMatchId;

		// createLocalCart(currentRestaurantId);
	}

	async function createLocalCart(currentRestaurantId) {
		//Create in FB
		const newCartRef = await addDoc(collection(db, 'carts'), {
			userId: 'anonymous',
			restaurantId: currentRestaurantId,
			items: [],
		});
		console.log('New cart written with ID: ', newCartRef.id);

		//Add cartId to LS
		let cartList = JSON.parse(window.localStorage.getItem('cartList'));
		console.log('cartList: ', cartList);
		let newCartId = newCartRef.id;
		// console.log('cartList', cartList);
		cartList.push(newCartId);

		localStorage.setItem('cartList', JSON.stringify(cartList));

		let newItemList = ['test taco', 'test burrito'];

		updateDoc(doc(db, 'carts', newCartRef.id), { items: newItemList });

		// console.log('newCartRef.items: ', newCartRef.items);

		// if (localCartList.value) {
		// 	console.log('theres a local cart list: ', localCartList.value);

		// }

		// console.log('newCartList: ', newCartList);
		// window.localStorage.setItem('cartList', newCartList);
	}

	async function addToCart(currentRestaurantId) {
		console.log('currentRestaurantId: ', currentRestaurantId);
		// == A. If logged out
		if (!user.authUser) {
			// 1. check if any carts in local storage cart list
			if (await window.localStorage.getItem('cartList')) {
				console.log('yes existing cart list. ', localCartList.value);
				// 2. loop thru carts in LS, check each for restaurant ID match
				if (await findRestaurantCart(currentRestaurantId)) {
					console.log('FOUND CART MATCH IN DB: ');
					// console.log('foundCart: ', findRestaurantCart(currentRestaurantId));
					// 	// do something with the foundCart (reduce & add new item to it)
				} else {
					console.log('CART MATCH NOT FOUND IN DB');
				}

				// 2a. if no match, create a new cart,
				// add item, & assign cartId to local storage
			} else {
				console.log('no cart list yet. ', localCartList.value);
				// 3. if no carts in LS, create a new blank cartlist
				localStorage.setItem('cartList', JSON.stringify([]));
				createLocalCart(currentRestaurantId);

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
	// 3. if any, check if currentRestaurantId matches current restaurant
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
