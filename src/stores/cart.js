import { ref, reactive, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useFirestore, useCollection, useDocument } from 'vuefire';
import { collection, doc, getDoc, addDoc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';
import { userService } from '@/services/userService';
import { useRoute } from 'vue-router';

export const useCartStore = defineStore('cart', function () {
	// Pull cart DB
	const db = useFirestore();
	const cartDb = useCollection(collection(db, 'carts'));
	// Set constants - LS cart list
	const localCartList = ref(window.localStorage.getItem('cartList'));
	const restaurantId = computed(function () {
		return route.params.slug;
	});

	const user = userService();
	const route = useRoute();

	const cartRef = computed(function () {
		if (user.authUser) {
			//logged in
		} else {
			const localCarts = getLocalCarts();
			return collection(db, 'carts', localCarts[0], 'items');
		}
	});

	function getLocalCarts() {
		return JSON.parse(window.localStorage.getItem('cartList'));
	}

	const items = useCollection(cartRef);
	//
	// const count = computed(function () {
	// 	return items.value.length;
	// });

	// TODO: EXPAND TO HANDLE NOTES
	const groupedItems = computed(function () {
		return items.value.reduce(function (group, item) {
			console.log('group: ', group);
			// is there a key called guac
			if (group[item.name]) {
				// if (group[item.notes]){
				// } else {
				// 	group[item.name] = [];
				// }
				// group[item.name] = group[item.name];
			} else {
				group[item.name] = [];
			}
			group[item.name].push(item);
			return group;
		}, {});
		// group (the "accumulator") starts with empty object {}
	});

	async function remove(itemId) {
		const localCarts = getLocalCarts();
		await deleteDoc(doc(db, 'carts', localCarts[0], 'items', itemId));
	}

	function searchCart(newItem) {
		return items.value.find(function (itemInCart) {
			return newItem.id == itemInCart.id && newItem.notes == itemInCart.notes;
		});
	}

	function clearCart() {
		for (const item of items.value) {
			remove(item.id);
		}
	}

	// const quantity = computed(function () {
	// 	let qty = 0;
	// 	items.value.forEach(function (item) {
	// 		qty += item.quantity;
	// 	});

	// 	return qty;
	// });

	// =================== New Pseudocode ========================
	// == Setup

	// ==== ADD ITEMS TO CART function: ====
	function addToCart(item, notes) {
		// console.log('currentRestaurantId: ', currentRestaurantId);
		// == A. If logged out
		console.log('items.value: ', items.value);
		if (!user.authUser) {
			handleLocalCarts(item, notes);
		}
	}
	async function handleLocalCarts(item, notes) {
		// 1. check if any carts in local storage cart list
		if (window.localStorage.getItem('cartList')) {
			console.log('yes existing cart list. ', localCartList.value);
			// 2. loop thru carts in LS, check each for restaurant ID match
			const restaurantFound = await findRestaurantCart();
			if (restaurantFound) {
				addToExistingCart(restaurantFound, item, notes);
			} else {
				// 2a. if no match, create a new cart,
				createAnonymousCart(item);
				// add item, & assign cartId to local storage
			}
		} else {
			console.log('no cart list yet. ', localCartList.value);
			// 3. if no carts in LS, create a new blank cartlist
			localStorage.setItem('cartList', JSON.stringify([]));
			createAnonymousCart(item);

			// add item, & assign cartId to local storage
		}
	}

	function addToExistingCart(cartId, item, notes) {
		console.log(
			'(Step 2 Should be 2nd bc should use the results of step 1) FOUND CART MATCH IN DB: ',
		);
		console.log('addToEXISTING -- cartId: ', cartId);
		console.log('addToEXISTING -- item: ', item);
		const newItemRef = addDoc(collection(db, 'carts', cartId, 'items'), item);
	}

	function restaurantNotFoundAction() {
		console.log('Step 2 CART MATCH NOT FOUND IN DB');
	}

	async function findRestaurantCart() {
		let localCarts = JSON.parse(window.localStorage.getItem('cartList'));
		let cartData = '';

		console.log('localCarts: ', localCarts);

		for (const localCartId of localCarts) {
			const docSnap = await getDoc(doc(db, 'carts', localCartId));
			cartData = docSnap.data();
			console.log('cartData: ', cartData);

			if (cartData.restaurantId == restaurantId.value) {
				console.log('Step 1 MATCH FOUND');
				console.log('docSnap.id', docSnap.id);
				return docSnap.id;
			} else {
				console.log('Step 1 MATCH NOT FOUND');
			}
		}

		return false;
	}

	async function createAnonymousCart(item) {
		//Create in FB
		const newCartRef = await addDoc(collection(db, 'carts'), {
			userId: 'anonymous',
			restaurantId: restaurantId.value,
			createdDate: Date.now(),
		});
		console.log('New cart written with ID: ', newCartRef.id);

		const newItemRef = addDoc(collection(db, 'carts', newCartRef.id, 'items'), item);

		//Add cartId to LS
		let cartList = JSON.parse(window.localStorage.getItem('cartList'));
		console.log('cartList: ', cartList);
		let newCartId = newCartRef.id;
		// console.log('cartList', cartList);
		cartList.push(newCartId);

		localStorage.setItem('cartList', JSON.stringify(cartList));
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
	// function searchCart(newItem) {
	// 	return items.value.find(function (itemInCart) {
	// 		return newItem.id == itemInCart.id && newItem.notes == itemInCart.notes;
	// 	});
	// }

	// function add(item, qty, notes) {
	// 	const newItem = { ...item, id: item.id, notes: notes };

	// 	const newQty = Number(qty);
	// 	newItem.quantity = newQty;

	// 	// check if this item was found in the list
	// 	const found = searchCart(newItem);

	// 	if (found) {
	// 		console.log('item found in cart');
	// 		found.quantity += newQty;
	// 	} else {
	// 		console.log('item not found in cart');
	// 		items.value.push(newItem);
	// 	}
	// }

	// function remove(excludeItem) {
	// 	items.value = items.value.filter(function (item) {
	// 		return item.id != excludeItem.id || item.notes != excludeItem.notes;
	// 	});
	// }

	// function plusOne(item) {
	// 	item.quantity += 1;
	// }

	// function minusOne(item) {
	// 	item.quantity -= 1;
	// }

	// function clearCart() {
	// 	if (window.confirm('Are you sure you want to remove everything from your cart?') == true) {
	// 		items.value = [];
	// 	}
	// }

	// const allSubtotal = computed(function () {
	// 	let cartSubtotal = 0;
	// 	items.value.forEach(function (item) {
	// 		item.subtotal = item.price * item.quantity;
	// 		cartSubtotal += item.subtotal;
	// 	});
	// 	return cartSubtotal;
	// });

	return {
		items,
		groupedItems,

		// count,
		// add,
		remove: remove,
		// quantity,
		// plusOne,
		// minusOne,
		// allSubtotal,
		clearCart,
		addToCart,
	};
});
