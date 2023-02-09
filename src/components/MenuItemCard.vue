<script setup>
	import { ref, computed } from 'vue';
	import { collection, doc, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
	import { useFirestore, useCollection, useDocument } from 'vuefire';
	import { useRoute } from 'vue-router';
	import { useCartStore } from '@/stores/cart';

	const route = useRoute();
	const db = useFirestore();
	const props = defineProps(['item']);
	const currentItem = props.item;
	const cart = useCartStore();

	const categories = useCollection(collection(db, 'restaurants', route.params.slug, 'categories'));

	// ============= ITEM U.D. =============
	// ==== UPDATE ====
	const editing = ref(false);

	function editItem(id, name) {
		editing.value = id;
	}

	function clearEdit() {
		editing.value = false;
	}

	function updateItem(id, newName, newPrice, newDescription, newCategory, newImageUrl) {
		setDoc(doc(db, 'restaurants', route.params.slug, 'items', id), {
			name: newName,
			price: newPrice,
			description: newDescription,
			belongsToCategory: newCategory,
			imageUrl: newImageUrl,
		});
		clearEdit();
	}

	// ==== DELETE =====
	async function removeItem(id) {
		const record = doc(db, 'restaurants', route.params.slug, 'items', id);
		if (confirm('Are you sure you want to delete this menu item?')) {
			await deleteDoc(record);
		}
	}

	// ============= CART-ADD MODAL =============
	const cartAddOpen = ref(false);
	const cartAddItem = ref(null);
	const qty = ref(1);
	const notes = ref('');

	function openCartAdd(item) {
		cartAddOpen.value = true;
		cartAddItem.value = item;
	}

	function closeCartAdd() {
		cartAddOpen.value = false;
		cartAddItem.value = null;
		clearAddItem();
	}

	function clearAddItem() {
		notes.value = '';
		qty.value = 1;
	}

	document.addEventListener('keydown', (e) => {
		if (cartAddOpen && e.keyCode == 27) {
			closeCartAdd();
		}
	});
</script>

<template>
	<div class="itemCard">
		<picture>
			<img :src="item.imageUrl" alt="" />
		</picture>
		<h3 class="voice3">{{ item.name }}</h3>
		<div>${{ item.price }}</div>
		<div>{{ item.description }}</div>

		<div class="addToCartButton">
			<button @click="openCartAdd(item)">Add to cart</button>
		</div>

		<!-- ======== CART-ADD MODAL ======== -->
		<Transition>
			<div class="modal cartAdd" v-if="cartAddOpen" @click="closeCartAdd()">
				<div class="dialogue" @click.stop>
					<button @click.prevent="closeCartAdd()">Close</button>
					<h2 class="loud-voice">{{ cartAddItem.name }}</h2>
					<picture>
						<img :src="item.imageUrl" alt="" />
					</picture>
					<div>${{ item.price }}</div>
					<div>{{ item.description }}</div>
					<form action="">
						<label for="cartNote">Special Requests</label>
						<input id="cartNote" type="text" v-model="notes" />
						<label for="quantity">Quantity</label>
						<input
							id="quantity"
							type="number"
							min="1"
							max="99"
							v-model="qty"
							ref="firstField"
						/>
						<button
							@click.prevent="
								cart.add(cartAddItem, qty, notes);
								closeCartAdd();
							"
						>
							Add to cart
						</button>
					</form>
				</div>
			</div>
		</Transition>
		<!-- ======== / CART-ADD MODAL ======== -->

		<!-- ======== ADMIN PANEL ======== -->
		<div class="adminPanel">
			<button @click="removeItem(item.id)" type="button">X</button>

			<button @click="editItem(item.id)" v-if="editing != item.id">Edit!</button>

			<template v-if="editing == item.id">
				<input type="text" placeholder="Name" v-model="item.name" />
				$<input type="number" placeholder="Price" v-model="item.price" />
				<input type="text" placeholder="Description" v-model="item.description" />
				<select v-model="item.belongsToCategory" :value="item.belongsToCategory" required>
					<!-- <option disabled value="">Please select one</option> -->
					<option v-for="category in categories" :value="category.id">
						{{ category.name }}
					</option>
				</select>
				<input type="text" placeholder="Image URL" v-model="item.imageUrl" />
				<button
					@click="
						updateItem(
							item.id,
							item.name,
							item.price,
							item.description,
							item.belongsToCategory,
							item.imageUrl,
						)
					"
				>
					Update
				</button>
				<button @click="clearEdit()">Cancel</button>
			</template>
		</div>
		<!-- ======== / ADMIN PANEL ======== -->
	</div>
</template>

<style scoped>
	.itemCard {
		border: 1px solid red;
	}
	picture {
		/*		aspect-ratio: 1/1;*/
		/*		width: 200px;*/
		width: 100%;
		height: 250px;
	}

	.dialogue {
		/*		width: 60vw; Todo: Define this later */
	}
	.modal picture {
		border: 2px solid blue;
		height: 400px;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
