<script setup lang="ts">
	defineProps<{
		title: string;
		value: string;
	}>();
</script>

<template>
	<div class="bank_info-item">
		<h3 class="title">{{ title }}</h3>

		<span class="value">{{ value }}</span>
	</div>
</template>
