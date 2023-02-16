<script setup>
	import { userService } from '@/services/userService';

	const user = userService();

	user.signOut();
</script>

<template>
	<h1 class="voice1">SIGN OUT</h1>
</template>

<style scoped></style>
