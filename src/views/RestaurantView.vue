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

	const currentRestaurant1 = computed(function () {
		return restaurants.value.find(function (record) {
			return record.id == route.params.slug;
		});
	});

	// const currentRestaurant2 = ref(useDocument(doc(db, 'restaurants', route.params.slug)));
</script>

<template>
	<div>cr1: {{ currentRestaurant1.name }}</div>
	<!-- <div>cr2: {{ currentRestaurant2.name }}</div> -->
	<div>Tags: {{ currentRestaurant1 }}</div>
	<MenuList :key="$route.path" />
</template>

<style scoped></style>
