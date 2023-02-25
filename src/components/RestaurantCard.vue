<script setup>
	import SvgIcons from '@/components/icons/IconTemplate.vue';
	import { userService } from '@/services/userService';
	import { defineProps, ref, reactive, computed } from 'vue';
	import { useFirestore, useCollection } from 'vuefire';
	import { collection, doc, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
	const props = defineProps([
		'restaurant',
		'tags',
		'priceLevels',
		'avgWaitTimes',
		'user',
		'userFavorites',
	]);
	// defineProps(['restaurant']);

	const user = userService();
	const db = useFirestore();

	// const favList = user.favoriteRestaurants;
	// FAVORITES

	const favorited = computed(function () {
		// console.log('userFavorites: ', props.userFavorites);
		if (props.userFavorites) {
			return props.userFavorites.find((favoriteId) => favoriteId == props.restaurant.id);
		}
	});

	function toggleUserFavorite(restaurantId) {
		if (user.authUser) {
			user.toggleFavorite(restaurantId);
		} else {
			alert('Log in to save favorites');
		}
	}

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

	// ==== DELETE =====
	async function removeRestaurant(docId) {
		const record = doc(db, 'restaurants', docId);
		if (confirm('Are you sure you want to delete this restaurant?')) {
			await deleteDoc(record);
		}
	}
</script>

<template>
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
			</div>
		</div>
		<!-- {{ user.alreadyFavorite(restaurant.id) }} -->
	</RouterLink>

	<!-- ======== FAVORITES ======== -->

	<div
		class="favHeart"
		@click="toggleUserFavorite(restaurant.id)"
	>
		<div class="test">
			<SvgIcons
				class="svg-icon full"
				name="heart-full"
				v-if="user.authUser && favorited"
			/>
			<SvgIcons
				v-else
				class="svg-icon empty"
				name="heart-empty"
			/>
		</div>
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
</template>

<style scoped>
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

	.restaurant-stats {
		display: flex;
		flex-direction: column;
		gap: 10px;
		color: var(--light-ink);
	}
</style>
