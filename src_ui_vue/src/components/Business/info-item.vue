<script setup lang="ts">
	defineProps<{
		title: string;
	}>();
</script>

<template>
	<div class="business_info-item">
		<h4 class="business_info-name">{{ title }}</h4>
		<span class="business_info-value"><slot /></span>
	</div>
</template>
