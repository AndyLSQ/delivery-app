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
			<p>{{ item.name }}</p>
			<p>Notes: "{{ item.notes }}"</p>
			<p>${{ item.price }}</p>
			<p>Qty: {{ item.quantity }}</p>
			<p>Subtotal: {{ item.subtotal }}</p>
			<button @click="cart.plusOne(item)">plus</button>
			<button v-if="item.quantity > 1" @click="cart.minusOne(item)">minus</button>
			<button @click="cart.remove(item.id)">delete {{ item.id }}</button>
		</li>
	</ul>
	<p>Total quantity: {{ cart.quantity }}</p>
	<p>Subtotal: ${{ cart.subtotal }}</p>
	<p>Delivery fee:</p>
	<p>Tax:</p>
	<p>Total:</p>
	<!-- {{ cart.consolList }} -->
</template>

<style></style>
