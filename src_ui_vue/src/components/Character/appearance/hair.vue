<script setup lang="ts">
	import Selector from '../selector.vue';

	defineProps<{
		style: number;
		color: number;
		highlight: number;

		update: (prop: string, value: number) => void;
	}>();
</script>

<template>
	<div>
		<Selector
			title="Стрижка"
			:items="[...Array(74).keys()]"
			:value="style"
			@change="(value) => update('style', value)"
		/>
		<Selector
			title="Основной цвет"
			:items="[...Array(71).keys()]"
			:value="color"
			@change="(value) => update('color', value)"
		/>
		<Selector
			title="Доп. цвет"
			:items="[...Array(71).keys()]"
			:value="highlight"
			@change="(value) => update('highlight', value)"
		/>
	</div>
</template>
