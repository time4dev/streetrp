<script setup lang="ts">
	import Selector from '@/components/Common/selector.vue';

	defineProps<{
		title: string;
		items: number[] | string[];
		value: number | string;
		customValue?: string;
	}>();

	const emit = defineEmits<{ change: [value: any] }>();
</script>

<template>
	<Selector
		className="character_selector"
		circle-button
		:title="title"
		:items="items"
		:value="value"
		:custom-value="customValue"
		@change="emit('change', $event)"
	/>
</template>
