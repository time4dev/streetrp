<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import Cell from './cell.vue';

	const props = defineProps<{
		onClick: (id: string) => Promise<void>;
	}>();

	const items = ref<number[]>([]);

	onMounted(() => {
		rpc.callServer('Vehicle-GetPassengers').then((data: number[]) => (items.value = data));
	});

	async function kickPassenger(id: string) {
		await props.onClick(id);

		items.value = items.value.filter((item) => item !== +id);
	}
</script>

<template>
	<Cell
		v-for="item in items"
		:key="item"
		label="passengers"
		:title="`Гражданин (${item})`"
		@click="kickPassenger(item.toString())"
	/>
</template>
