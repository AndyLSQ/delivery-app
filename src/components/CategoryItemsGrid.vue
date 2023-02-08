<script setup>
	import { computed } from 'vue';
	import MenuItemCard from '@/components/MenuItemCard.vue';

	const props = defineProps(['category', 'items']);

	const categoryItems = computed(function () {
		return props.items.filter(function (item) {
			return item.belongsToCategory == props.category.id;
		});
	});
</script>

<template>
	<div class="category">
		<h2 class="voice2">{{ category.name }}</h2>
		<div>{{ category.description }}</div>
		<ul class="categoryGrid">
			<li v-for="item in categoryItems">
				<MenuItemCard :item="item" />
			</li>
		</ul>
	</div>
</template>

<style scoped>
	/*.category {
		display: flex;
		flex-direction: column;
		border: 3px solid yellow;
	}*/
	.categoryGrid {
		border: 2px solid blue;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
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
