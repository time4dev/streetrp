<script setup lang="ts">
	defineProps<{
		children?: string;
		className?: string;
	}>();
</script>

<template>
	<h2 :class="['primary-title', className]">
		<slot />
	</h2>
</template>
