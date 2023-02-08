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

	function updateItem(id, newName, newPrice, newCourse) {
		setDoc(doc(db, 'restaurants', 'mcdonalds', 'menu', id), {
			name: newName,
			price: newPrice,
			course: newCourse,
		});
		clearEdit();
	}

	// ==== DELETE =====
	async function removeItem(id) {
		const record = doc(db, 'restaurants', 'mcdonalds', 'menu', id);
		if (confirm('Are you sure you want to delete this menu item?')) {
			await deleteDoc(record);
		}
	}
</script>

<template>
	<h1>Menu List</h1>
	current restaurant: {{ currentRestaurant }}
	<ul>
		<li v-for="item in menu">
			<!-- <p>ID: {{ item.id }}</p> -->
			{{ item.course }}
			{{ item.name }}
			${{ item.price }}
			<div class="adminPanel">
				<!-- TODO: ^ v-if user is an admin -->
				<button @click="removeItem(item.id)" type="button">x</button>
				<button
					@click="editItem(item.id, item.name, item.price, item.course)"
					v-if="editing != item.id"
				>
					Edit
				</button>
				<template v-if="editing == item.id">
					<input type="text" placeholder="Name" v-model="item.name" />
					$<input type="number" placeholder="Price" v-model="item.price" />
					<input type="text" placeholder="Course" v-model="item.course" />
					<button @click="updateItem(item.id, item.name, item.price, item.course)">
						Update
					</button>
					<button @click="clearEdit()">Cancel</button>
				</template>
			</div>
		</li>
	</ul>
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
			<label for="newItemName">Course</label>
			<input
				type="text"
				id="newItemName"
				v-model="form.course"
				placeholder="Appetizer, Main, Drink, Dessert"
			/>
		</div>
		<button type="submit">Add</button>
	</form>
</template>

<style scoped></style>
