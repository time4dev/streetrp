<script setup lang="ts">
	import Cell from './cell.vue';
	import Item from './item.vue';
	import type { InventoryItem } from './index.vue';

	const props = withDefaults(
		defineProps<{
			items: InventoryItem[];
			startIndex: number;
			cells: number;
			available?: number;
			storage?: string;
		}>(),
		{ storage: 'self' }
	);
</script>

<template>
	<div class="inventory_grid">
		<template v-for="index in props.cells" :key="index">
			<Cell
				class="inventory_grid-cell"
				:id="props.startIndex + index - 1"
				:blocked="typeof props.available === 'number' ? props.available <= index - 1 : false"
				:storage="props.storage"
			>
				<template v-if="(typeof props.available === 'number' ? props.available > index - 1 : true) && props.items[props.startIndex + index - 1]">
					<Item
						:id="props.startIndex + index - 1"
						:name="props.items[props.startIndex + index - 1].name"
						:amount="props.items[props.startIndex + index - 1].amount"
						:storage="props.storage"
					/>
				</template>
			</Cell>
		</template>
	</div>
</template>
