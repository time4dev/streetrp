<script setup lang="ts">
	defineProps<{
		name: string;
		status: string;
	}>();
</script>

<template>
	<div class="call_info">
		<p class="name">{{ name }}</p>
		<span>{{ status }}</span>
	</div>
</template>
