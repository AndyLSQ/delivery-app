<script setup>
	import { useRoute } from 'vue-router';
	import { useRestaurantStore } from '@/stores/restaurants';

	const route = useRoute();
	const restaurants = useRestaurantStore();

	const restaurant = restaurants.list.find(function (record) {
		return record.slug == route.params.slug;
	});
</script>

<template>
	<!-- {{ route.params.slug }} -->
	<h1 class="loud-voice">{{ restaurant.name }}</h1>
</template>
