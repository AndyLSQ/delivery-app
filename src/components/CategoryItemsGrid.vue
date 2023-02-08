<script setup>
	import { computed } from 'vue';
	import MenuItemCard from '@/components/MenuItemCard.vue';

	const props = defineProps(['category', 'items']);

	const categoryItems = computed(function () {
		return props.items.filter(function (item) {
			// console.log('item.belongsToCategory', item.belongsToCategory);
			// console.log('props.category.id', props.category.id);
			return item.belongsToCategory == props.category.id;
		});
	});
</script>

<template>
	<!-- {{ category }} -->
	<!-- {{ items }} -->
	<!-- {{ categoryItems }} -->
	<ul>
		<li v-for="item in categoryItems">
			<picture>
				<img :src="item.imageUrl" alt="" />
			</picture>
			<h3 class="voice3">{{ item.name }}</h3>
			${{ item.price }}
			{{ item.description }}
		</li>
	</ul>
</template>

<style scoped>
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
