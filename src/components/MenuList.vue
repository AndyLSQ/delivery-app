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

	function clearForm() {
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
		clearForm();
	}

	// == (CATEGORY) ==
	const categoryForm = reactive({
		name: '',
		description: '',
	});

	function clearCategoryForm() {
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
		<div class="adminPanel addCategory">
			<form
				class="adminPanel"
				@submit.prevent="addCategory()"
			>
				<h2 class="voice2">Add Category</h2>
				<div>
					<label for="newCategoryName">Category name</label>
					<input
						type="text"
						id="newCategoryName"
						v-model="categoryForm.name"
					/>
				</div>
				<div>
					<label for="newCategoryDescription">Description</label>
					<input
						type="text"
						id="newCategoryDescription"
						v-model="categoryForm.description"
					/>
				</div>

				<button type="submit">Add</button>
			</form>
		</div>
		<div class="adminPanel addItem">
			<form @submit.prevent="addItem()">
				<h2 class="voice2">Add Item</h2>
				<div>
					<label for="newItemName">Item Name</label>
					<input
						type="text"
						id="newItemName"
						v-model="form.name"
					/>
				</div>
				<div>
					<label for="newItemPrice">Price</label>
					<input
						type="number"
						id="newItemPrice"
						v-model="form.price"
					/>
				</div>
				<div>
					<label for="newItemDescription">Item Description</label>
					<input
						type="text"
						id="newItemDescription"
						v-model="form.description"
					/>
				</div>
				<div>
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
				<div>
					<label for="newItemImageUrl">Item ImageUrl</label>
					<input
						type="text"
						id="newItemImageUrl"
						v-model="form.imageUrl"
					/>
				</div>
				<button type="submit">Add</button>
			</form>
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
</style>
