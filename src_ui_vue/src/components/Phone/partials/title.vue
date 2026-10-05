<script setup lang="ts">
	defineProps<{
		className?: string;
	}>();
</script>

<template>
	<h2 :class="['phone_title', className]">
		<slot />
	</h2>
</template>
