<script setup>
	// Imports
	import { ref, reactive, computed, onMounted } from 'vue';
	import { collection, doc, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
	import { useFirestore, useCollection, useDocument } from 'vuefire';
	import { useRoute } from 'vue-router';

	import SvgIcons from '@/components/icons/IconTemplate.vue';

	import CategoryItemsGrid from '@/components/CategoryItemsGrid.vue';

	// Declarations
	const route = useRoute();

	// ==== FB SETUP ====
	const db = useFirestore();
	// Set FB collection as reactive data
	const restaurants = useCollection(collection(db, 'restaurants'));

	// ==== RESTAURANT ROUTING ====

	const currentRestaurant = computed(function () {
		return restaurants.value.find(function (record) {
			return record.id == route.params.slug;
		});
	});

	const categories = useCollection(collection(db, 'restaurants', route.params.slug, 'categories'));

	const items = useCollection(collection(db, 'restaurants', route.params.slug, 'items'));

	// ==== CREATE ====
	// == (ITEM) ==
	const form = reactive({
		name: '',
		price: '',
		category: '', // TODO: Add radio buttons for this
		description: '',
		imageUrl: 'https://peprojects.dev/images/square.jpg',
	});

	function clearItemForm() {
		form.name = '';
		form.price = '';
		form.category = '';
		form.description = '';
		form.imageUrl = 'https://peprojects.dev/images/square.jpg';
	}

	function addItem() {
		addDoc(collection(db, 'restaurants', route.params.slug, 'items'), {
			name: form.name,
			price: form.price,
			belongsToCategory: form.category,
			description: form.description,
			imageUrl: form.imageUrl,
		});
		clearItemForm();
	}

	// == (CATEGORY) ==
	const categoryForm = reactive({
		name: '',
		description: '',
	});

	function clearCategoryForm() {
		// console.log('clear category Form');
		categoryForm.name = '';
		categoryForm.description = '';
	}

	function addCategory() {
		addDoc(collection(db, 'restaurants', route.params.slug, 'categories'), {
			id: 'test-id',
			name: categoryForm.name.toLowerCase(),
			description: categoryForm.description,
		});
		clearCategoryForm();
	}

	// ==== UPDATE ====
	// == (ITEM) ==
	// const editing = ref(false);

	// function editItem(id, name) {
	// 	editing.value = id;
	// }

	// function clearEdit() {
	// 	editing.value = false;
	// }

	// function updateItem(id, newName, newPrice, newCategory) {
	// 	setDoc(doc(db, 'restaurants', 'mcdonalds', 'items', id), {
	// 		name: newName,
	// 		price: newPrice,
	// 		belongsToCategory: newCategory,
	// 	});
	// 	clearEdit();
	// }

	// == (CATEGORY) ==

	// ==== DELETE =====
	// == (ITEM) ==
	async function removeItem(id) {
		const record = doc(db, 'restaurants', 'mcdonalds', 'items', id);
		if (confirm('Are you sure you want to delete this menu item?')) {
			await deleteDoc(record);
		}
	}

	// == (CATEGORY) ==

	// ===== MODALS =====
	const addCategoryModalOpen = ref(false);
	function openAddCategoryModal() {
		// console.log('open add category modal');
		addCategoryModalOpen.value = true;
	}
	function closeAddCategoryModal() {
		// console.log('close add category modal');
		addCategoryModalOpen.value = false;
		clearCategoryForm();
		// console.log('addCategoryModalOpen.value: ', addCategoryModalOpen.value);
	}

	const addItemModalOpen = ref(false);
	function openAddItemModal() {
		addItemModalOpen.value = true;
	}
	function closeAddItemModal() {
		addItemModalOpen.value = false;
		clearItemForm();
	}

	document.addEventListener('keydown', (e) => {
		if (addCategoryModalOpen && e.keyCode == 27) {
			addCategoryModalOpen.value = false;
		}
		if (addItemModalOpen && e.keyCode == 27) {
			addItemModalOpen.value = false;
		}
		// if (editCategoryModalOpen && e.keyCode == 27) {
		// 	editCategoryModalOpen.value = false;
		// }
	});
</script>

<template>
	<div
		class="router-view"
		:key="$route.path"
	>
		<!-- {{ currentRestaurant.name }}  -->
		<div class="headline">
			<div class="eyebrow">Build your meal</div>
			<h2 class="voice1">Menu selection</h2>
		</div>

		<ul class="categories">
			<li v-for="category in categories">
				<CategoryItemsGrid
					:category="category"
					:items="items"
				/>
			</li>
		</ul>
		<!-- TODO: Add form to add categories -->
		<div class="admin-add-buttons admin-panel">
			<button
				class="toggle-add"
				@click="openAddCategoryModal()"
			>
				<SvgIcons
					class="svg-icon"
					name="add"
				/>
				<div>Add Category</div>
			</button>

			<div
				class="addCategory modal"
				v-if="addCategoryModalOpen"
				@click="closeAddCategoryModal()"
			>
				<div
					class="dialogue"
					@click.stop
				>
					<form
						class="admin-panel-form"
						@submit.prevent="addCategory()"
					>
						<h2 class="voice2">Add Category</h2>
						<div class="form-field">
							<label for="newCategoryName">Category name</label>
							<input
								type="text"
								id="newCategoryName"
								v-model="categoryForm.name"
							/>
						</div>
						<div class="form-field">
							<label for="newCategoryDescription">Description</label>
							<input
								type="text"
								id="newCategoryDescription"
								v-model="categoryForm.description"
							/>
						</div>
						<div class="form-buttons">
							<button type="submit">Add</button>
							<button
								class="close"
								@click="closeAddCategoryModal()"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>

			<button
				class="toggle-add"
				@click="openAddItemModal()"
			>
				<SvgIcons
					class="svg-icon"
					name="add"
				/>
				<div>Add Item</div>
			</button>

			<div
				class="addItem modal"
				v-if="addItemModalOpen"
				@click="closeAddItemModal()"
			>
				<div
					class="dialogue"
					@click.stop
				>
					<form
						class="admin-panel-form"
						@submit.prevent="addItem()"
					>
						<h2 class="voice2">Add Item</h2>
						<div class="form-field">
							<label for="newItemName">Item Name</label>
							<input
								type="text"
								id="newItemName"
								v-model="form.name"
							/>
						</div>
						<div class="form-field">
							<label for="newItemPrice">Price</label>
							<input
								type="number"
								id="newItemPrice"
								v-model="form.price"
							/>
						</div>
						<div class="form-field">
							<label for="newItemDescription">Item Description</label>
							<input
								type="text"
								id="newItemDescription"
								v-model="form.description"
							/>
						</div>
						<div class="form-field">
							<label for="newItemName">Category</label>
							<select v-model="form.category">
								<option
									v-for="category in categories"
									:value="category.id"
								>
									{{ category.name }}
								</option>
							</select>
						</div>
						<div class="form-field">
							<label for="newItemImageUrl">Item ImageUrl</label>
							<textarea
								rows="2"
								cols="50"
								type="text"
								id="newItemImageUrl"
								v-model="form.imageUrl"
							/>
						</div>
						<div class="form-buttons">
							<button type="submit">Add</button>
							<button
								class="close"
								@click="closeAddItemModal()"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.categories {
		/*		border: 1px solid yellow;*/
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.router-view {
		/*		border: 3px solid red;*/
		margin-top: 100px;
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.admin-add-buttons {
		display: flex;
		gap: 2rem;
		align-items: center;
		padding: 30px 0px;
		/*		justify-content: center;*/
	}
</style>
