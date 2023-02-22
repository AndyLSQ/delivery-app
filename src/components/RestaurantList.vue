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
	const tags = useCollection(collection(db, 'tags'));
	const priceLevels = useCollection(collection(db, 'priceLevel'));
	const avgWaitTimes = useCollection(collection(db, 'avgWaitTime'));
	const favorites = useFavoritesStore();
	const errorImage = '@/assets/images/image-not-found.jpg';

	// ========== CRUD SETUP ==========
	// TODO: CUD FOR ADMIN ONLY

	// ==== CREATE (FORM) ====
	// Reactive object to hold form inputs
	const form = reactive({
		name: '',
		tags: [], // TODO: Add checkboxes for this
		imageUrl: 'https://peprojects.dev/images/landscape.jpg',
		priceLevel: '',
		avgWaitTime: '',
	});

	function clearForm() {
		form.name = '';
		form.tags = [];
		form.imageUrl = 'https://peprojects.dev/images/landscape.jpg';
		form.priceLevel = '';
		form.avgWaitTime = '';
	}

	function addRestaurant() {
		addDoc(collection(db, 'restaurants'), {
			name: form.name,
			imageUrl: form.imageUrl,
			tags: form.tags,
			priceLevel: form.priceLevel,
			avgWaitTime: form.avgWaitTime,
		});
		closeAddRestaurantModal();
	}

	// == Add Restaurant Modal ==
	const addRestaurantModalOpen = ref(false);
	function openAddRestaurantModal() {
		console.log('addRestaurantModalOpen');
		addRestaurantModalOpen.value = true;
	}
	function closeAddRestaurantModal() {
		addRestaurantModalOpen.value = false;
		clearForm();
	}

	// Keydown for add & edit modals
	document.addEventListener('keydown', (e) => {
		if (addRestaurantModalOpen && e.keyCode == 27) {
			addRestaurantModalOpen.value = false;
		}
		if (editing.value && e.keyCode == 27) {
			editing.value = false;
		}
	});

	// ==== READ (CUSTOMER FAVORITES) ====
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

	//

	// ==== UPDATE ====
	// PULL FB DATA INTO UPDATE FORM (CREATE NEW REACTIVE OBJECTS)
	// const update = reactive({ ...props.item });

	// ==== UPDATE (VENDOR RESTAURANTS) ====
	const editing = ref(false);
	const update = ref(null);
	// const checkedTags = ref([]);

	function editRestaurant(restaurant, id, name, imageUrl) {
		editing.value = restaurant.id; //was: id (delete id from args)
		update.value = { ...restaurant };
		console.log('update: ', update.value);
	}

	function save(restaurant) {
		console.log(restaurant.id);
		console.log('update: ', update);
		// console.log('checkedTags.value: ', checkedTags.value);
		const recordToSave = {
			name: update?.value.name,
			imageUrl: update?.value.imageUrl,
			tags: update?.value.tags,
			priceLevel: update?.value.priceLevel,
			avgWaitTime: update?.value.avgWaitTime,
		};
		console.log('recordToSave', recordToSave);
		setDoc(doc(db, 'restaurants', restaurant.id), recordToSave);
		clearEdit();
	}

	function clearEdit() {
		editing.value = false;
		// update.vaule = null;
	}

	// function updateRestaurant() {}

	// function updateRestaurant(restaurant, id, name, imageUrl) {
	// 	setDoc(doc(db, 'restaurants', id), {
	// 		name: name,
	// 		imageUrl: imageUrl,
	// 	});
	// 	clearEdit();
	// }

	//

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
						<div class="restaurant-stats">
							<div class="">
								<span>{{ restaurant.priceLevel }}</span> • {{ restaurant.avgWaitTime }}
							</div>
							<div class="tags-display">
								<div
									class="tag-display"
									v-for="tag in restaurant.tags"
								>
									{{ tag }}
								</div>
							</div>

							<!-- <div class="">
								Price Level: <span>{{ restaurant.priceLevel }}</span>
							</div>
							<div class="">
								Avg Wait: <span>{{ restaurant.avgWaitTime }}</span>
							</div> -->
						</div>

						<!-- 	<p class="quiet-voice">
							This is where the restaurant description will go. Right here in this spot. No
							one knows how long it will be but hopefully not too long.
						</p> -->
						<!-- <p>{{ restaurant.tags }}</p> -->
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

					<!-- ======== "EDIT" MODAL ======== -->
					<button
						class=""
						@click="editRestaurant(restaurant, restaurant.id, restaurant.name)"
					>
						<SvgIcons
							class="svg-icon edit"
							name="edit"
						/>
					</button>

					<div
						v-if="editing == restaurant.id"
						class="modal admin-panel"
						@click="clearEdit()"
					>
						<div
							class="dialogue"
							@click.stop
						>
							<form>
								<h2 class="voice1">Edit Restaurant</h2>
								<div class="form-field">
									<label for="restaurant-name">Restaurant Name</label>
									<input
										id="restaurant-name"
										type="text"
										placeholder="Restaurant Name"
										v-model="update.name"
									/>
								</div>
								<div class="form-field">
									<label for="image-url">Image URL</label>
									<input
										id="image-url"
										type="text"
										placeholder="Image URL"
										v-model="update.imageUrl"
									/>
								</div>
								<div class="form-field">
									<label for="tag-checks">Tags</label>
									<div class="tag-list">
										<ul
											id="tag-checks"
											v-for="tag in tags"
										>
											<li class="checkbox">
												<input
													type="checkbox"
													:id="`check-${tag.id}`"
													:value="tag.id"
													v-model="update.tags"
												/>
												<label
													class="checkbox-label"
													:for="`check-${tag.id}`"
													>{{ tag.id }}</label
												>
											</li>
										</ul>
									</div>
								</div>

								<div class="form-field">
									<label for="form-price-level">Price level</label>
									<select
										name="priceLevel"
										id="form-price-level"
										v-model="update.priceLevel"
									>
										<option
											disabled
											value=""
										>
											Please select one
										</option>
										<option
											v-for="priceLevel in priceLevels"
											:value="priceLevel.id"
										>
											{{ priceLevel.label }}
										</option>
									</select>
								</div>

								<!-- <div class="form-field">
									<label for="form-price-level">Price Level (OLD)</label>
									<select
										name="priceLevel"
										id="form-price-level"
										v-model="update.priceLevel"
									>
										<option value="">Please select one</option>
										<option value="$">$ - (Entrees average under $10)</option>
										<option value="$$">$$ - (Entrees average $10 - $25)</option>
										<option value="$$$">$$$ - (Entrees average $25 - $50)</option>
										<option value="$$$$">$$$$ - (Entrees average $50 - $100)</option>
										<option value="$$$$$">$$$$$ - (Entrees average over $100)</option>
									</select>
								</div> -->

								<div class="form-field">
									<label for="form-wait-time">Average wait time</label>
									<select
										name="avgWaitTime"
										id="form-wait-time"
										v-model="update.avgWaitTime"
									>
										<option
											disabled
											value=""
										>
											Please select one
										</option>
										<option
											v-for="avgWaitTime in avgWaitTimes"
											:value="avgWaitTime.label"
										>
											{{ avgWaitTime.label }}
										</option>
									</select>
								</div>

								<!-- 			<option value="20">20 - 30 min</option>
										<option value="30">20 - 30 min</option>
										<option value="45">20 - 30 min</option>
										<option value="60">20 - 30 min</option>
										<option value="61">20 - 30 min</option> -->

								<div class="form-buttons">
									<button
										class=""
										@click="save(restaurant)"
									>
										Update
									</button>
									<button
										class=""
										@click="clearEdit()"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</li>
		</ul>

		<!-- ======== "ADD" MODAL ======== -->

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
				@click="closeAddRestaurantModal()"
			>
				<div
					class="dialogue"
					@click.stop
				>
					<form @submit.prevent="addRestaurant()">
						<h2 class="voice2">Add new restaurant</h2>
						<div class="form-field">
							<label for="newRestName">Restaurant name</label>
							<input
								type="text"
								id="newRestName"
								v-model="form.name"
								required
							/>
						</div>
						<div class="form-field">
							<label for="newRestImageURL">Image URL</label>
							<input
								type="text"
								id="newRestImageURL"
								v-model="form.imageUrl"
								required
							/>
						</div>

						<div class="form-field preview">
							<label for="img-preview">Image Preview</label>

							<div class="picture-contain">
								<!-- <p v-if="imageLoadError">hi there</p> -->
								<picture id="img-preview">
									<img
										:src="form.imageUrl"
										@error="errorImage"
									/>
								</picture>
							</div>
						</div>
						<div class="form-field">
							<label for="tag-checks">Tags</label>
							<div class="tag-list">
								<ul
									id="tag-checks"
									v-for="tag in tags"
								>
									<li class="checkbox">
										<input
											type="checkbox"
											:id="`check-${tag.id}`"
											:value="tag.id"
											v-model="form.tags"
										/>
										<label
											class="checkbox-label"
											:for="`check-${tag.id}`"
											>{{ tag.id }}</label
										>
									</li>
								</ul>
							</div>
						</div>

						<div class="form-field">
							<label for="form-price-level">Price level</label>
							<select
								name="priceLevel"
								id="form-price-level"
								v-model="form.priceLevel"
								required
							>
								<option
									disabled
									value=""
								>
									Please select one
								</option>
								<option
									v-for="priceLevel in priceLevels"
									:value="priceLevel.id"
								>
									{{ priceLevel.label }}
								</option>
							</select>
						</div>
						<div class="form-field">
							<label for="form-wait-time">Average wait time</label>
							<select
								name="avgWaitTime"
								id="form-wait-time"
								v-model="form.avgWaitTime"
								required
							>
								<option
									disabled
									value=""
								>
									Please select one
								</option>
								<option
									v-for="avgWaitTime in avgWaitTimes"
									:value="avgWaitTime.label"
								>
									{{ avgWaitTime.label }}
								</option>
							</select>
						</div>

						<!-- <div class="form-field">
							<label for="form-price-level">Price Level (OLD)</label>
							<select
								name="priceLevel"
								id="form-price-level"
								v-model="form.priceLevel"
							>
								<option
									disabled
									value=""
								>
									Please select one
								</option>
								<option value="$">$ - (Entrees under $10)</option>
								<option value="$$">$$ - (Entrees $10 - $25)</option>
								<option value="$$$">$$$ - (Entrees $25 - $50)</option>
								<option value="$$$$">$$$$ - (Entrees $50 - $100)</option>
								<option value="$$$$$">$$$$$ - (Entrees over $100)</option>
							</select>
						</div> -->
						<div class="form-buttons">
							<button type="submit">Add</button>
							<button
								class="close"
								@click="closeAddRestaurantModal()"
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

<!-- STYLE -->
<style scoped>
	.restaurant-card {
		position: relative;
	}

	.favHeart {
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
		/*		border: 1px solid red;*/
		/*		box-shadow: var(--card-shadow);*/
	}

	.toggle-add .svg-icon {
		width: 1.1rem;
		height: 1.1rem;
	}

	.restaurant-stats {
		/*		margin-top: 5px;*/
		display: flex;
		flex-direction: column;
		/*		display: grid;*/
		/*		grid-template-columns: repeat(3, 1fr);*/
		gap: 10px;
		color: var(--light-ink);
	}

	.restaurant-stats span {
		/*		color: var(--highlight);*/
	}
</style>
