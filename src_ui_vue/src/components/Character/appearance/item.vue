<script setup lang="ts">
	import Selector from '../selector.vue';

	defineProps<{
		style: number;
		color: number;

		styles: number;

		update: (style: number, color: number) => void;
	}>();
</script>

<template>
	<div>
		<Selector
			title="Стиль"
			:items="[-1, ...Array(styles + 1).keys()]"
			:value="style"
			:custom-value="`${style + 1}`"
			@change="(value) => update(value, color)"
		/>
		<Selector
			title="Цвет"
			:items="[...Array(71).keys()]"
			:value="color"
			@change="(value) => update(style, value)"
		/>
	</div>
</template>
