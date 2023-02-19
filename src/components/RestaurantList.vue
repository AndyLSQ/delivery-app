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

	// == Add Restaurant Modal ==
	const addRestaurantModalOpen = ref(false);
	function openAddRestaurantModal() {
		console.log('addRestaurantModalOpen');
		addRestaurantModalOpen.value = true;
	}
	function closeAddRestaurantModal() {
		addRestaurantModalOpen.value = false;
	}

	document.addEventListener('keydown', (e) => {
		if (addRestaurantModalOpen && e.keyCode == 27) {
			addRestaurantModalOpen.value = false;
		}
	});

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
	<div class="section">
		<div class="headline">
			<div class="eyebrow">Eat local, eat fresh</div>
			<h2 class="voice1">Nearby Restaurants</h2>
		</div>
		<ul class="restaurantGrid card-grid">
			<li
				class="card restaurant-card"
				v-for="restaurant in userRestaurants"
			>
				<RouterLink :to="`/restaurant/${restaurant.id}`">
					<picture>
						<img
							:src="restaurant.imageUrl"
							alt=""
						/>
					</picture>
					<div class="card-text">
						<h2 class="voice3">{{ restaurant.name }}</h2>
						<p class="quiet-voice">
							This is where the restaurant description will go. Right here in this spot. No
							one knows how long it will be but hopefully not too long.
						</p>
					</div>
				</RouterLink>
				<div
					class="favHeart"
					@click="favorites.toggleFavorite(restaurant.id)"
				>
					<SvgIcons
						v-if="restaurant.favorite"
						class="svg-icon full"
						name="heart-full"
					/>
					<SvgIcons
						v-else
						class="svg-icon empty"
						name="heart-empty"
					/>
				</div>

				<div class="admin-panel-inline">
					<!-- TODO: ^ v-if user is an admin -->
					<button
						class="warn"
						@click="removeRestaurant(restaurant.id)"
						type="button"
					>
						<SvgIcons
							class="svg-icon trash"
							name="trash"
						/>
					</button>
					<button
						class=""
						@click="editRestaurant(restaurant.id, restaurant.name)"
						v-if="editing != restaurant.id"
					>
						<SvgIcons
							class="svg-icon edit"
							name="edit"
						/>
					</button>
					<form v-if="editing == restaurant.id">
						<input
							type="text"
							placeholder="Restaurant Name"
							v-model="restaurant.name"
						/>
						<input
							type="text"
							placeholder="Image URL"
							v-model="restaurant.imageUrl"
						/>
						<button
							class=""
							@click="updateRestaurant(restaurant.id, restaurant.name, restaurant.imageUrl)"
						>
							Update
						</button>
						<button
							class=""
							@click="clearEdit()"
						>
							Cancel
						</button>
					</form>
				</div>
			</li>
		</ul>

		<div class="admin-panel">
			<button
				class="toggle-add"
				@click="openAddRestaurantModal()"
			>
				<SvgIcons
					class="svg-icon"
					name="add"
				/>
				New Restaurant
			</button>
			<div
				class="modal"
				v-if="addRestaurantModalOpen"
			>
				<div class="dialogue">
					<button
						class="close"
						@click="closeAddRestaurantModal()"
					>
						<SvgIcons
							class="svg-icon close"
							name="close"
						/>
					</button>
					<form @submit.prevent="addRestaurant()">
						<h2 class="voice2">Add item</h2>
						<label for="newRestName">Restaurant name</label>
						<input
							type="text"
							id="newRestName"
							v-model="form.name"
						/>
						<button type="submit">Add</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.restaurant-card {
		position: relative;
	}

	.favHeart {
		z-index: 10;
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
		fill: var(--light-ink);
		background-color: var(--white);
		box-shadow: var(--card-shadow);
		border: 1px solid var(--light-gray);
	}
	.svg-icon {
		height: 1.5rem;
		width: 1.5rem;
	}

	.favHeart:hover {
		fill: var(--highlight);
	}

	.favHeart .full {
		fill: var(--highlight);
	}

	.favHeart .full:hover {
		/*		fill: var(--light-ink);*/
	}

	.toggle-add {
		padding: 10px 20px;
	}

	.toggle-add .svg-icon {
		width: 1.1rem;
		height: 1.1rem;
	}
</style>
