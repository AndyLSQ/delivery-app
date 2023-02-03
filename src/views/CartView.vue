<script setup>
	import { ref, computed, onBeforeMount, onMounted } from 'vue';
	import { useRoute } from 'vue-router';
	import { useRestaurantStore } from '@/stores/restaurants';
	import { useCartStore } from '@/stores/cart';
	import SvgIcons from '@/components/icons/IconTemplate.vue';

	const route = useRoute();
	const restaurants = useRestaurantStore();
	const cart = useCartStore();
</script>

<template>
	<div class="empty-cart" v-if="cart.items == ''">
		<p>Your cart is empty.</p>
		<picture class="empty-cart-image">
			<SvgIcons class="svg-icons" name="food" />
		</picture>
		<p>Add items to get started</p>
	</div>
	<div class="full-cart" v-else>
		<h1 class="voice1">Cart</h1>
		<button @click="cart.clearCart()">Clear Cart</button>
		<ul>
			<li class="cartItem" v-for="item in cart.items">
				<h2 class="voice3">{{ item.name }}</h2>
				<p v-if="item.notes">
					<em>{{ item.notes }}</em>
				</p>
				<!-- <p>${{ item.price }}</p> -->
				<div>${{ item.subtotal }}</div>
				<button v-if="item.quantity == 1" @click="cart.remove(item.id)">D</button>
				<button v-if="item.quantity > 1" @click="cart.minusOne(item)">-</button>
				{{ item.quantity }}
				<button @click="cart.plusOne(item)">+</button>
			</li>
		</ul>

		<!-- <p>Total quantity: {{ cart.quantity }}</p> -->
		<ul class="cartCalc">
			<li>Cart Subtotal: ${{ cart.allSubtotal }}</li>
			<!-- <li>Delivery fee:</li>
		<li>Tax:</li>
		<li>Total:</li> -->
		</ul>
		<button>Checkout</button>
		<!-- {{ cart.consolList }} -->
	</div>
</template>

<style scoped>
	.cartItem {
		border: 1px solid red;
	}
</style>
