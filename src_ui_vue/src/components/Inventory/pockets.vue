<script setup lang="ts">
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import Grid from './grid.vue';
	import type { InventoryItem } from './index.vue';

	defineProps<{
		items: InventoryItem[];
	}>();
</script>

<template>
	<div class="inventory_pockets">
		<PrimaryTitle className="inventory_title">Карманы</PrimaryTitle>

		<Grid :cells="6" :start-index="0" :items="items" />
	</div>
</template>
