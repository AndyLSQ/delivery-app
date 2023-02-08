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

	// const menu = useCollection(collection(db, 'restaurants', route.params.slug, 'menu'));

	const categories = useCollection(collection(db, 'restaurants', route.params.slug, 'categories'));

	const items = useCollection(collection(db, 'restaurants', route.params.slug, 'items'));

	// ==== CREATE ====
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
			belongsToCategory: form.category.name,
			description: form.description,
			imageUrl: form.imageUrl,
		});
		clearForm();
	}

	// ==== UPDATE ====
	const editing = ref(false);

	function editItem(id, name) {
		editing.value = id;
	}

	function clearEdit() {
		editing.value = false;
	}

	function updateItem(id, newName, newPrice, newCategory) {
		setDoc(doc(db, 'restaurants', 'mcdonalds', 'items', id), {
			name: newName,
			price: newPrice,
			belongsToCategory: newCategory,
		});
		clearEdit();
	}

	// ==== DELETE =====
	async function removeItem(id) {
		const record = doc(db, 'restaurants', 'mcdonalds', 'items', id);
		if (confirm('Are you sure you want to delete this menu item?')) {
			await deleteDoc(record);
		}
	}
</script>

<template>
	<div class="router-view" :key="$route.path">
		<h1 class="voice1">Menu</h1>

		<ul class="categories">
			<li v-for="category in categories">
				<CategoryItemsGrid :category="category" :items="items" />
			</li>
		</ul>
		<!-- TODO: Add form to add categories -->
		<!-- <div class="addCategory">
			<form class="adminPanel" @submit.prevent="addItem()">
				<h2 class="voice2">Add Item</h2>
				<div>
					<label for="newItemName">Item name</label>
					<input type="text" id="newItemName" v-model="form.name" />
				</div>
				<div>
					<label for="newItemPrice">Price</label>
					<input type="number" id="newItemPrice" v-model="form.price" />
				</div>
				<div>
					<label for="newItemName">Category</label>
					<select>
						<option v-for="category in categories" :value="category">
							{{ category.name }}
						</option>
					</select>
				</div>
				<button type="submit">Add</button>
			</form>
		</div> -->
		<div class="adminPanel addItem">
			<form @submit.prevent="addItem()">
				<h2 class="voice2">Add Item</h2>
				<div>
					<label for="newItemName">Item Name</label>
					<input type="text" id="newItemName" v-model="form.name" />
				</div>
				<div>
					<label for="newItemPrice">Price</label>
					<input type="number" id="newItemPrice" v-model="form.price" />
				</div>
				<div>
					<label for="newItemDescription">Item Description</label>
					<input type="text" id="newItemDescription" v-model="form.description" />
				</div>
				<div>
					<label for="newItemName">Category</label>
					<select v-model="form.category">
						<option v-for="category in categories" :value="category">
							{{ category.name }}
						</option>
					</select>
				</div>
				<div>
					<label for="newItemImageUrl">Item ImageUrl</label>
					<input type="text" id="newItemImageUrl" v-model="form.imageUrl" />
				</div>
				<button type="submit">Add</button>
			</form>
		</div>
	</div>
</template>

<style scoped>
	.categories {
		border: 3px solid yellow;
		display: flex;
		flex-direction: column;
		gap: 40px;
	}
</style>
