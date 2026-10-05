<script setup lang="ts">
	defineProps<{
		className?: string;
	}>();
</script>

<template>
	<div :class="['phone_items-group', className]">
		<slot />
	</div>
</template>
