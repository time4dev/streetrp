<script setup lang="ts">
	import Cell from './cell.vue';
	import Item from './item.vue';
	import type { InventoryItem } from './index.vue';

	const props = defineProps<{
		equip: (cell: number, slot: string) => void;
		items: { [name: string]: InventoryItem };
	}>();

	function handleDrop(sourceId: number | string, targetId: number | string) {
		props.equip(sourceId as number, targetId as string);
	}
</script>

<template>
	<div class="inventory_quick">
		<h3 class="inventory_quick-title">Быстрый доступ</h3>

		<div class="inventory_quick-grid">
			<template v-for="index in 3" :key="index">
				<Cell
					class="inventory_quick-cell"
					:id="`quick_${index}`"
					:on-drop="handleDrop"
					:blocked="!!props.items[`quick_${index}`]"
				>
					<template v-if="props.items[`quick_${index}`]">
						<Item
							:id="`quick_${index}`"
							:name="props.items[`quick_${index}`].name"
							:amount="1"
							hide-amount
						/>
					</template>

					<span class="inventory_quick-key">{{ index }}</span>
				</Cell>
			</template>
		</div>
	</div>
</template>
