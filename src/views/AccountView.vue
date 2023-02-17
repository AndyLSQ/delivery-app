<script setup>
	import { ref, computed, onBeforeMount, onMounted } from 'vue';
	import { useRoute } from 'vue-router';
	import { userService } from '@/services/userService';
	import AccountNav from '@/components/AccountNav.vue';
	import { RouterLink, RouterView } from 'vue-router';

	const user = userService();
	const route = useRoute();
</script>

<template>
	<AccountNav />
	<div v-if="user.currentFB">
		<button
			type="button"
			@click="user.signOut()"
		>
			signout
		</button>
		<!-- User: {{ user.currentFB.email }} -->
		User email: {{ user?.info.email }}
		<h1 class="voice1">Test Area</h1>
		<p>{{ user?.info.roles }}</p>
		<p v-if="user.isAdmin">THIS IS AN ADMIN</p>
		<p>Name: {{ user?.info.firstName }}</p>
	</div>
	<RouterView />
</template>

<style></style>
