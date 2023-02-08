<script setup>
	import { ref, computed } from 'vue';
	import { collection, doc, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
	import { useFirestore, useCollection, useDocument } from 'vuefire';
	import { useRoute } from 'vue-router';

	const route = useRoute();
	const db = useFirestore();
	const props = defineProps(['item']);
	const currentItem = props.item;

	const categories = useCollection(collection(db, 'restaurants', route.params.slug, 'categories'));

	// ==== UPDATE ====
	const editing = ref(false);

	function editItem(id, name) {
		editing.value = id;
	}

	function clearEdit() {
		editing.value = false;
	}

	function updateItem(id, newName, newPrice, newDescription, newCategory, newImageUrl) {
		setDoc(doc(db, 'restaurants', route.params.slug, 'items', id), {
			name: newName,
			price: newPrice,
			description: newDescription,
			belongsToCategory: newCategory,
			imageUrl: newImageUrl,
		});
		clearEdit();
	}

	// ==== DELETE =====
	async function removeItem(id) {
		const record = doc(db, 'restaurants', route.params.slug, 'items', id);
		if (confirm('Are you sure you want to delete this menu item?')) {
			await deleteDoc(record);
		}
	}
</script>

<template>
	<div class="itemCard">
		<picture>
			<img :src="item.imageUrl" alt="" />
		</picture>
		<h3 class="voice3">{{ item.name }}</h3>
		<div>${{ item.price }}</div>
		<div>{{ item.description }}</div>
		<!-- {{ item.belongsToCategory }} -->
		<div class="adminPanel">
			<button @click="removeItem(item.id)" type="button">X</button>

			<button @click="editItem(item.id)" v-if="editing != item.id">Edit!</button>

			<template v-if="editing == item.id">
				<input type="text" placeholder="Name" v-model="item.name" />
				$<input type="number" placeholder="Price" v-model="item.price" />
				<input type="text" placeholder="Description" v-model="item.description" />
				<select v-model="item.belongsToCategory" :value="item.belongsToCategory" required>
					<!-- <option disabled value="">Please select one</option> -->
					<option v-for="category in categories" :value="category">
						{{ category.name }}
					</option>
				</select>
				<input type="text" placeholder="Image URL" v-model="item.imageUrl" />
				<button
					@click="
						updateItem(
							item.id,
							item.name,
							item.price,
							item.description,
							item.belongsToCategory,
							item.imageUrl,
						)
					"
				>
					Update
				</button>
				<button @click="clearEdit()">Cancel</button>
			</template>
		</div>
	</div>
</template>

<style scoped>
	.itemCard {
		border: 1px solid red;
	}
	picture {
		/*		aspect-ratio: 1/1;*/
		/*		width: 200px;*/
		width: 100%;
		height: 250px;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
