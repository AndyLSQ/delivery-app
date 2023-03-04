<script setup>
	import { ref, reactive, computed } from 'vue';
	import { collection, doc, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
	import { useFirestore, useCollection, useDocument } from 'vuefire';
	import { useRoute } from 'vue-router';
	import { useCartStore } from '@/stores/cart';
	import SvgIcons from '@/components/icons/IconTemplate.vue';

	const route = useRoute();
	const db = useFirestore();
	const props = defineProps(['item']);
	const currentItem = props.item;
	const cart = useCartStore();

	const categories = useCollection(collection(db, 'restaurants', route.params.slug, 'categories'));

	// ============= ITEM U.D. =============

	// PULL FB DATA INTO UPDATE FORM (CREATE NEW REACTIVE OBJECTS)
	// const update = reactive({ ...props.item });

	// function save(id) {
	// 	console.log(update);
	// 	// const recordToSave = {
	// 	// 	...props.item,
	// 	// 	...update,
	// 	// };
	// 	// console.log('recordToSave: ', recordToSave);
	// 	// setDoc(doc(db, 'restaurants', route.params.slug, 'items', id), recordToSave);
	// }

	// ==== UPDATE ====
	const editing = ref(false);
	const update = reactive({ ...props.item });

	function editItem(item, id) {
		editing.value = id;
	}

	function clearEdit() {
		editing.value = false;
	}

	function save(item) {
		// console.log(item.id);
		// console.log('save() update.value: ', update.value);
		const recordToSave = {
			// ...props.item,
			...update,
		};
		// console.log('recordToSave: ', recordToSave);
		setDoc(doc(db, 'restaurants', route.params.slug, 'items', item.id), recordToSave);
		clearEdit();
	}

	// function updateItem(id, newName, newImageUrl, newPrice, newDescription, newCategory) {
	// 	setDoc(doc(db, 'restaurants', route.params.slug, 'items', id), {
	// 		name: newName,
	// 		imageUrl: newImageUrl,
	// 		price: newPrice,
	// 		description: newDescription,
	// 		belongsToCategory: newCategory,
	// 	});
	// 	clearEdit();
	// }

	document.addEventListener('keydown', (e) => {
		if (editing.value && e.keyCode == 27) {
			clearEdit();
		}
	});

	// ==== DELETE =====
	async function removeItem(id) {
		const record = doc(db, 'restaurants', route.params.slug, 'items', id);
		if (confirm('Are you sure you want to delete this menu item?')) {
			await deleteDoc(record);
		}
	}
	// ==== / DELETE =====

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
	<div class="card">
		<div
			class="item-card"
			@click="openCartAdd(item)"
		>
			<picture>
				<!-- template allows me to reference prop direclty, but in script would need to say props.item -->
				<img
					:src="item.imageUrl"
					alt=""
				/>
			</picture>
			<div class="card-text">
				<h3 class="voice3">{{ item.name }}</h3>
				<div class="item-description">{{ item.description }}</div>
				<div class="item-price">{{ $filters.currencyUSD(item.price) }}</div>

				<button
					@click="openCartAdd(item)"
					class="add-to-cart-button"
				>
					<SvgIcons
						class="svg-icon edit"
						name="add"
					/>
				</button>
			</div>
		</div>
		<!-- ======== CART-ADD MODAL ======== -->
		<Transition>
			<div
				class="modal cartAdd"
				v-if="cartAddOpen"
				@click="closeCartAdd()"
			>
				<div
					class="dialogue"
					@click.stop
				>
					<button @click.prevent="closeCartAdd()">Close</button>
					<h2 class="loud-voice">{{ cartAddItem.name }}</h2>
					<picture>
						<img
							:src="item.imageUrl"
							alt=""
						/>
					</picture>
					<div>${{ item.price }}</div>
					<div>{{ item.description }}</div>
					<form action="">
						<label for="cartNote">Special Requests</label>
						<textarea
							rows="4"
							cols="50"
							maxlength="200"
							id="cartNote"
							type="text"
							v-model="notes"
						/>
						<div class="character-counter quiet-voice">{{ notes.length }}/200 characters</div>
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
								// TODO: USE THESE ARGS: cart.add(cartAddItem, qty, notes);
								cart.addToCart(item, notes, qty);
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

		<div class="admin-panel-inline">
			<button
				class="warn"
				@click="removeItem(item.id)"
				type="button"
			>
				<SvgIcons
					class="svg-icon trash"
					name="trash"
				/>
			</button>

			<!-- ======== "EDIT" MODAL ======== -->
			<button @click="editItem(item, item.id)">
				<!-- v-if="editing != item.id" -->
				<SvgIcons
					class="svg-icon edit"
					name="edit"
				/>
			</button>
			<div
				v-if="editing == item.id"
				class="modal admin-panel"
				@click="clearEdit()"
			>
				<!-- HEREEEEEE -->

				<div
					class="dialogue"
					@click.stop
				>
					<form>
						<h2 class="voice1">Edit Item</h2>
						<div class="form-field">
							<label for="edit-item-name">Name</label>
							<input
								id="edit-item-name"
								type="text"
								placeholder="Name"
								v-model="update.name"
							/>
						</div>
						<div class="form-field">
							<label for="edit-item-image">Image URL</label>
							<textarea
								class="edit-item-image"
								type="text"
								placeholder="Image URL"
								rows="3"
								cols="50"
								v-model="update.imageUrl"
							/>
						</div>
						<div class="form-field preview">
							<label for="img-preview">Image Preview</label>

							<div class="picture-contain">
								<!-- <p v-if="imageLoadError">hi there</p> -->
								<picture id="img-preview">
									<img
										:src="update.imageUrl"
										@error="errorImage"
									/>
								</picture>
							</div>
						</div>
						<div class="form-field">
							<label for="edit-item-price">price</label>
							<input
								id="edit-item-price"
								type="number"
								step="0.01"
								min="0"
								placeholder="Price"
								v-model="update.price"
							/>
						</div>
						<div class="form-field">
							<label for="edit-item-description">description</label>
							<textarea
								id="edit-item-description"
								type="text"
								placeholder="Description"
								rows="4"
								cols="50"
								v-model="update.description"
							/>
						</div>
						<div class="form-field">
							<label for="edit-item-category">category</label>
							<select
								id="edit-item-category"
								v-model="update.belongsToCategory"
								:value="update.belongsToCategory"
								required
							>
								<!-- <option disabled value="">Please select one</option> -->
								<option
									v-for="category in categories"
									:value="category.id"
								>
									{{ category.name }}
								</option>
							</select>
						</div>

						<div class="form-buttons">
							<button
								type="button"
								@click="save(item)"
							>
								Update
							</button>
							<button
								type="button"
								@click="clearEdit()"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>

				<!-- END HEREEEE -->
			</div>
		</div>
		<!-- ======== / ADMIN PANEL ======== -->
	</div>
</template>

<style scoped>
	.card {
		position: relative;
	}
	.item-card {
		cursor: pointer;
	}

	.item-card .item-description {
		color: var(--light-ink);
	}

	.item-card .item-price {
		margin-top: 15px;
		color: var(--highlight);
	}

	.add-to-cart-button {
		z-index: 2;
		/*		width: 3rem;*/
		position: absolute;
		top: 178px;
		right: 15px;
		padding: 10px;
		border-radius: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		fill: var(--white);
		background-color: var(--highlight);
		box-shadow: var(--card-shadow);
		border: none;
	}

	.add-to-cart-button:hover {
		background-color: var(--highlight-hover);
		box-shadow: var(--card-shadow-hover);
	}

	.add-to-cart-button .svg-icon {
		height: 1.5rem;
		width: 1.5rem;
	}

	.dialogue {
		/*		width: 60vw; Todo: Define this later */
	}

	/*	.modal picture {
		border: 2px solid blue;
		height: 400px;
	}*/

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
