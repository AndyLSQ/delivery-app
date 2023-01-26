<script setup></script>

<template>
	<button @click="">Close</button>
	<h2 class="loud-voice">Add to cart - [ITEM NAME HERE]</h2>
	<p>[Item image]</p>
	<p>[Item description]</p>
	<form action="">
		<label for="cartNote">Special Requests</label>
		<input id="cartNote" type="text" />
		<label for="quantity">Quantity</label>
		<input id="quantity" type="number" min="1" max="99" value="1" />
		<button>Add to cart</button>
	</form>
</template>
