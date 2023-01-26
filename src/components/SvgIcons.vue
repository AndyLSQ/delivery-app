<script setup>
	const props = defineProps(['name']);
</script>

<template>
	<!-- {{ name }} -->
	<svg :class="`icon-${name}`"><use :xlink:href="`#icon-${name}`"></use></svg>
</template>
