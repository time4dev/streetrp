<script setup lang="ts">
	defineProps<{
		title: string;
		value: string;
	}>();
</script>

<template>
	<div class="faction-docs_field">
		<h4 class="faction-docs_field-title">{{ title }}</h4>
		<span class="faction-docs_field-value">{{ value }}</span>
	</div>
</template>
