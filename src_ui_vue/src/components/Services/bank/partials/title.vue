<script setup lang="ts">
	defineProps<{
		children?: string;
	}>();
</script>

<template>
	<h2 class="bank_title"><slot /></h2>
</template>
