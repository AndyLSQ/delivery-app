\
<script setup>
	import { ref, computed, watch } from 'vue';
	import { useRoute } from 'vue-router';
	import { collection, doc, addDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
	import { useFirestore, useCollection, useDocument } from 'vuefire';
	import { useRestaurantStore } from '@/stores/restaurants';
	import { useMenuStore } from '@/stores/menu';
	import { useCartStore } from '@/stores/cart';
	import MenuList from '@/components/MenuList.vue';

	const route = useRoute();
	const db = useFirestore();
	const restaurants = useCollection(collection(db, 'restaurants'));
	const menu = useMenuStore();
	const cart = useCartStore();

	// const currentRestaurant1 = computed(function () {
	// 	return restaurants.value.find(function (record) {
	// 		return record.id == route.params.slug;
	// 	});
	// });

	const currentRestaurant = ref(useDocument(doc(db, 'restaurants', route.params.slug)));
</script>

<template>
	<!-- <div>cr1: {{ currentRestaurant1.name }}</div> -->

	<div
		class="banner"
		v-if="currentRestaurant"
	>
		<picture class="banner-image">
			<img
				:src="currentRestaurant.imageUrl"
				alt=""
			/>
		</picture>
		<div class="banner-text">
			<h2 class="loud-voice title">{{ currentRestaurant.name }}</h2>
			<div class="restaurant-info voice2">
				{{ currentRestaurant.priceLevel }} • {{ currentRestaurant.avgWaitTime }}
			</div>
		</div>
		<!-- <p>{{ currentRestaurant.imageUrl }}</p> -->
	</div>
	<!-- <div>Tags: {{ currentRestaurant1 }}</div> -->
	<MenuList :key="$route.path" />
</template>

<style scoped>
	.banner-text {
		color: var(--white);
		/*		transform: translate(0, -150px);*/
		margin-top: -150px;
		position: relative;
		z-index: 5;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 5px 30px;
		/*text-shadow: -1px 1px 1px var(--highlight), 1px 1px 1px var(--highlight),
			1px -1px 0 var(--highlight), -1px -1px 0 var(--highlight);*/
	}

	.banner-image {
		height: 450px;
		left: 50%;
		margin-top: -30px;
		margin-left: -50vw;
		margin-right: -50vw;
		max-width: 100vw;
		position: relative;
		right: 50%;
		width: 100vw;
	}

	.banner-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: brightness(40%);
	}

	.restaurant-info {
		font-weight: 500;
	}
</style>
