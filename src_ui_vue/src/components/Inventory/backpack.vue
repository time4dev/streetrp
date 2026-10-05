<script setup lang="ts">
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import Grid from './grid.vue';
	import type { InventoryItem } from './index.vue';

	defineProps<{
		items: InventoryItem[];
		cells: number;
	}>();
</script>

<template>
	<div class="inventory_backpack">
		<PrimaryTitle className="inventory_backpack-title">Рюкзак</PrimaryTitle>

		<Grid :start-index="6" :cells="24" :available="cells - 6" :items="items" />
	</div>
</template>
