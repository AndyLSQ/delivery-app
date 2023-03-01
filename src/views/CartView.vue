<script setup>
	import { ref, computed, onBeforeMount, onMounted } from 'vue';
	import { useRoute } from 'vue-router';
	import { useRestaurantStore } from '@/stores/restaurants';
	import SvgIcons from '@/components/icons/IconTemplate.vue';
	import { useCartStore } from '@/stores/cart';

	const route = useRoute();
	const restaurants = useRestaurantStore();
	const cart = useCartStore();
</script>

<template>
	<div
		class="empty-cart"
		v-if="cart.items == ''"
	>
		<p class="voice2">Your cart is empty</p>
		<picture class="empty-cart-image">
			<SvgIcons
				class="svg-icons"
				name="food"
			/>
		</picture>
		<p class="voice3">Add items to get started</p>
	</div>
	<div
		class="full-cart"
		v-else
	>
		<div class="header">
			<h1 class="voice1">Your Cart</h1>
			<div class="clear-contain">
				<button @click="cart.clearCart()">Clear Cart</button>
			</div>
		</div>
		<ul class="cart-list">
			<pre>
				<code>
{{cart.groupedItems}}
				</code>
			</pre>
			<li
				class="cart-item"
				v-for="group in cart.groupedItems"
			>
				<!-- <picture>
					<img
						:src="item.imageUrl"
						alt=""
					/>
				</picture> -->
				<div class="cart-item-text">
					<h2 class="voice3">{{ group[0].name }}</h2>
					<div
						v-if="group.notes"
						class="groupNotes"
					>
						<em>{{ group.length }}</em>
					</div>
					<p></p>
					<p>${{ group[0].price }}</p>
					<!-- <div>${{ item.subtotal }}</div> -->
				</div>
				<div class="quantity-buttons">
					<button
						v-if="group.length == 1"
						@click="cart.remove(group[0].id)"
					>
						<SvgIcons
							class="svg-icon"
							name="close"
						/>
					</button>
					<button
						v-if="group.length > 1"
						@click="cart.remove(group[0].id)"
					>
						<SvgIcons
							class="svg-icon"
							name="subtract"
						/>
					</button>
					<div class="quantity">{{ group.length }}</div>
					<!-- TODO: NEED TO CHANGE THIS -->
					<!-- Doesnt work if youre on a diff restaurant page -->
					<button @click="cart.addToCart(group[0])">
						<SvgIcons
							class="svg-icon"
							name="add"
						/>
					</button>
				</div>
			</li>
		</ul>

		<!-- <p>Total quantity: {{ cart.quantity }}</p> -->
		<ul class="cartCalc">
			<li class="voice3">Cart Subtotal: ${{ cart.allSubtotal }}</li>
			<!-- <li>Delivery fee:</li>
		<li>Tax:</li>
		<li>Total:</li> -->
		</ul>
		<button>Checkout</button>
		<!-- {{ cart.consolList }} -->
	</div>
</template>

<style scoped>
	.empty-cart {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3rem;
		padding: 2rem 0rem;
		color: var(--light-ink);
		fill: var(--light-ink);
		/*		overflow: scroll;*/
	}

	.full-cart {
		/*		border: 1px solid red;*/
		display: flex;
		flex-direction: column;
		gap: 50px;
		padding: 20px;
		overflow: scroll;
	}

	.full-cart .header {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.voice1 {
		font-size: 2.5rem;
	}
	.full-cart button {
		background-color: var(--highlight);
		border: none;
		border-radius: 10px;
		color: var(--white);
		font-family: inherit;
		font-size: 1.2rem;
		padding: 10px 20px;
		box-shadow: var(--shadow-subtle);
		transition: 0.3s ease-in-out;
	}

	.full-cart button:hover {
		background-color: var(--highlight-hover);
		transition: 0.3s ease-in-out;
	}

	.clear-contain button {
		font-size: 1rem;
		padding: 5px 10px;
		background-color: var(--warn);
		transition: 0.3s;
	}

	.clear-contain button:hover {
		background-color: var(--warn-hover);
		transition: 0.3s;
	}

	.cart-list {
		/*		border: 1px solid green;*/
		display: flex;
		flex-direction: column;
		gap: 30px;
		/*		overflow: scroll;*/
	}
	.cart-item {
		border: 1px solid var(--light-gray);
		border-radius: 10px;
		background-color: var(--paper);
		padding: 15px;
		display: flex;
		flex-direction: row;
		align-items: center;
		/*				justify-items: center;*/
		justify-content: space-between;
		box-shadow: var(--card-shadow);
		overflow: scroll;
		/*		align-content: center;*/
	}

	.quantity-buttons {
		background-color: var(--paper-gray);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border: 1px solid var(--light-gray);
		border-radius: 15px;
		overflow: hidden;
		padding: 5px;
		box-shadow: var(--shadow-subtle);
	}

	.quantity-buttons button {
		padding: 10px 12px;
		background-color: var(--white);
		color: var(--white);
		border-radius: 10px;
		border: none;
		transition: 0.3s ease-in-out;
	}

	.quantity-buttons button:hover {
		background-color: var(--paper-color);
		transition: 0.3s ease-in-out;
	}

	.quantity-buttons svg {
		width: 15px;
		height: 15px;
		fill: var(--highlight);
	}

	.quantity-buttons .quantity {
		width: 2rem;
		text-align: center;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.cart-item em {
		font-style: italic;
	}
</style>
