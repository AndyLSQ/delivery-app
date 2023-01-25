<script setup>
	import { ref, computed, onBeforeMount, onMounted } from 'vue';
	import { useRoute } from 'vue-router';
	import { useRestaurantStore } from '@/stores/restaurants';
	import { useCartStore } from '@/stores/cart';

	const route = useRoute();
	const restaurants = useRestaurantStore();
	const cart = useCartStore();
</script>

<template>
	<h1>this is the cart</h1>

	<h2>cart list</h2>
	<ul>
		<li v-for="item in cart.items">
			<p>{{ item.name }} ${{ item.price }}</p>
			<button @click="cart.remove(item.id)">delete {{ item.id }}</button>
		</li>
	</ul>
	<p>Total: ${{ cart.subtotal }}</p>
	{{ cart.consolList }}
</template>

<style></style>
