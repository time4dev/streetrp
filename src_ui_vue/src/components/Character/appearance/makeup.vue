<script setup lang="ts">
	import Selector from '../selector.vue';

	defineProps<{
		update: (id: number, value: number, color?: number) => void;
		values: [number, number][];
	}>();

	const items = [
		{
			id: 4,
			name: 'Макияж',
			max: 15,
			colors: 0
		},
		{
			id: 5,
			name: 'Румянец',
			max: 6,
			colors: 71
		},
		{
			id: 8,
			name: 'Помада',
			max: 9,
			colors: 71
		}
	];
</script>

<template>
	<div>
		<template v-for="item in items" :key="item.id">
			<Selector
				:title="item.name"
				:items="[-1, ...Array(item.max).keys()]"
				:value="values[item.id][0]"
				:custom-value="`${values[item.id][0] + 1}`"
				@change="(value) => update(item.id, value)"
			/>

			<Selector
				v-if="item.colors > 0"
				title="Цвет"
				:items="[...Array(item.colors).keys()]"
				:value="values[item.id][1]"
				@change="(value) => update(item.id, values[item.id][0], value)"
			/>
		</template>
	</div>
</template>
