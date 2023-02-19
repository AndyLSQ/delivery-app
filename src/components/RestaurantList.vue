<script setup>
	import { ref, reactive, computed, onMounted } from 'vue';
	import { useFirestore, useCollection } from 'vuefire';
	import { collection, doc, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
	import { useFavoritesStore } from '@/stores/favorites';
	import SvgIcons from '@/components/icons/IconTemplate.vue';

	// ==== FB SETUP ====
	const db = useFirestore();
	// Set FB collection of restaurants as reactive data
	const restaurants = useCollection(collection(db, 'restaurants'));
	const favorites = useFavoritesStore();

	// ========== CRUD SETUP ==========
	// TODO: CUD FOR ADMIN ONLY

	// ==== CREATE (FORM) ====
	// Reactive object to hold form inputs
	const form = reactive({
		name: '',
		tags: [], // TODO: Add checkboxes for this
		imageUrl: '',
	});

	function clearForm() {
		form.name = '';
		form.tags = [];
		form.imageUrl = '';
	}

	function addRestaurant() {
		addDoc(collection(db, 'restaurants'), {
			name: form.name,
			imageUrl: form.imageUrl,
		});
		clearForm();
	}

	// ==== READ (FAVORITES) ====
	// User specific array to track favorites
	const userRestaurants = computed(function () {
		const userRestaurantsArray = [];
		restaurants.value.forEach(function (restaurant) {
			if (favorites.favList.includes(restaurant.id)) {
				restaurant.favorite = true;
			} else {
				restaurant.favorite = false;
			}
			userRestaurantsArray.push(restaurant);
		});
		return userRestaurantsArray;
	});

	// ==== UPDATE ====
	const editing = ref(false);
	// const originalName = null;

	function editRestaurant(id, name, imageUrl) {
		editing.value = id;
		// originalName = name;
	}

	function clearEdit() {
		editing.value = false;
	}

	function updateRestaurant(id, r, imageUrl) {
		setDoc(doc(db, 'restaurants', id), {
			name: r,
			imageUrl: imageUrl,
		});
		clearEdit();
	}

	// ==== DELETE =====
	async function removeRestaurant(docId) {
		const record = doc(db, 'restaurants', docId);
		if (confirm('Are you sure you want to delete this restaurant?')) {
			await deleteDoc(record);
		}
	}
</script>

<template>
	<h2 class="voice2">Restaurant List</h2>
	<ul>
		<li class="restaurant-card" v-for="restaurant in userRestaurants">
			<RouterLink :to="`/restaurant/${restaurant.id}`">
				<picture>[ restaurant image ]</picture>
				{{ restaurant.name }}
			</RouterLink>
			<div class="favHeart" @click="favorites.toggleFavorite(restaurant.id)">
				<SvgIcons v-if="restaurant.favorite" class="svg-icon full" name="heart-full" />
				<SvgIcons v-else class="svg-icon empty" name="heart-empty" />
			</div>

			<div class="adminPanel">
				<!-- TODO: ^ v-if user is an admin -->
				<button @click="removeRestaurant(restaurant.id)" type="button">x</button>
				<button
					@click="editRestaurant(restaurant.id, restaurant.name)"
					v-if="editing != restaurant.id"
				>
					Edit
				</button>
				<template v-if="editing == restaurant.id">
					<input type="text" v-model="restaurant.name" />
					<button @click="updateRestaurant(restaurant.id, restaurant.name)">Update</button>
					<button @click="clearEdit()">Cancel</button>
				</template>
			</div>
		</li>
	</ul>
	<form class="adminPanel" @submit.prevent="addRestaurant()">
		<h2 class="voice2">Add item</h2>
		<label for="newRestName">Restaurant name</label>
		<input type="text" id="newRestName" v-model="form.name" />
		<button type="submit">Add</button>
	</form>
</template>

<style scoped>
	.restaurant-card {
		border: 2px solid red;
		position: relative;
	}
	.favHeart {
		z-index: 10;
		width: 3rem;
		position: absolute;
		top: 0;
		right: 0;
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.svg-icon {
		height: 1.5rem;
		width: 1.5rem;
	}
	.favHeart .empty:hover {
		fill: red;
	}

	.favHeart .full {
		fill: red;
	}

	.favHeart .full:hover {
		fill: black;
	}
</style>
