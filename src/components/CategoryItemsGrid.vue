<script setup>
	import { ref, reactive, computed } from 'vue';
	import { collection, doc, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
	import { useFirestore, useCollection, useDocument } from 'vuefire';
	import MenuItemCard from '@/components/MenuItemCard.vue';
	import { useRoute } from 'vue-router';
	import SvgIcons from '@/components/icons/IconTemplate.vue';

	const props = defineProps(['category', 'items']);

	const route = useRoute();

	// new
	// ==== FB SETUP ====
	const db = useFirestore();

	const currentCategory = props.category;
	// ============

	const categoryItems = computed(function () {
		return props.items.filter(function (item) {
			return item.belongsToCategory == props.category.id;
		});
	});

	// ==== UPDATE ====
	// == CATEGORY ==
	const editing = ref(false);
	const update = reactive({ ...props.category });

	function editCategory(id) {
		editing.value = id;
		console.log('editing', editing.value);
	}

	function clearEdit() {
		editing.value = false;
	}

	function save(category) {
		// console.log('category: ', category);
		const recordToSave = {
			...update,
		};
		setDoc(doc(db, 'restaurants', route.params.slug, 'categories', category.id), recordToSave);

		clearEdit();
	}

	// function updateCategory(id, newName, newDescription) {
	// 	setDoc(doc(db, 'restaurants', route.params.slug, 'categories', id), {
	// 		name: newName,
	// 		description: newDescription,
	// 	});
	// 	clearEdit();
	// }

	// ==== DELETE =====
	async function removeCategory(id) {
		const record = doc(db, 'restaurants', route.params.slug, 'categories', id);
		if (confirm('Are you sure you want to delete this category?')) {
			await deleteDoc(record);
		}
	}
</script>

<template>
	<div class="category">
		<div class="category-header">
			<div class="category-text">
				<h2 class="voice2">{{ category.name }}</h2>
				<div>{{ category.description }}</div>
			</div>
			<!-- ADD BUTTONS HERE -->
			<div class="category-panel admin-panel-inline">
				<button
					@click="removeCategory(category.id)"
					type="button"
					class="warn"
				>
					<SvgIcons
						class="svg-icon trash"
						name="trash"
					/>
				</button>
				<button @click="editCategory(category.id)">
					<SvgIcons
						class="svg-icon edit"
						name="edit"
					/>
				</button>

				<!-- ---EDIT MODAL--- -->
				<Transition>
					<div
						class="modal admin-panel"
						v-if="editing == category.id"
						@click="clearEdit()"
					>
						<div
							class="dialogue"
							@click.stop
						>
							<form>
								<h2 class="voice1">Edit Category</h2>
								<div class="form-field">
									<label for="edit-category-name-input">Name</label>
									<input
										id="edit-category-name-input"
										type="text"
										placeholder="Name"
										v-model="update.name"
									/>
								</div>
								<div class="form-field">
									<label for="edit-category-description-input">Description</label>
									<input
										id="edit-category-description-input"
										type="text"
										placeholder="Description"
										v-model="update.description"
									/>
								</div>
								<div class="form-buttons">
									<button @click.prevent="save(category)">Update</button>

									<button
										type="button"
										@click="clearEdit()"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</Transition>
			</div>
		</div>

		<ul
			v-if="categoryItems.length"
			class="card-grid"
		>
			<li
				v-for="item in categoryItems"
				:key="item.id"
			>
				<MenuItemCard :item="item" />
			</li>
		</ul>
		<p v-else>There are no menu items in this category yet.</p>
	</div>
</template>

<style scoped>
	.category {
		/*		border: 4px solid orange;*/
		background-color: var(--paper-color);
		border-radius: 10px;
		box-shadow: var(--card-shadow);
		padding: 30px;
		padding-bottom: 40px;
		display: flex;
		flex-direction: column;
		gap: 35px;
	}

	.category-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		/*		gap: 25px;*/
		/*		border: 1px solid blue;*/
	}

	.category-panel.admin-panel-inline {
		/*		border: 1px solid red;*/
		padding: 10px 0px;
	}
	picture {
		aspect-ratio: 1/1;
		width: 200px;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
