<script setup lang="ts">
	import { inject } from 'vue';
	import images from '@/utils/images';
	import { useDnd, dndState } from '@/composables/use-dnd';

	type InventoryContext = {
		onDrop: (item: number | string, cell: number, storage: string) => void;
		selectItem: (item?: any) => void;
		transferItem: (id: number, cell: number, storage: string) => void;
	};

	const props = withDefaults(
		defineProps<{
			id: number | string;
			name: string;
			amount: number;
			storage?: string;
			hideAmount?: boolean;
		}>(),
		{ storage: 'self' }
	);

	const context = inject<InventoryContext>('inventory-context')!;
	const { startDrag } = useDnd();

	function onClick() {
		if (dndState.moved) return;

		context.selectItem({ cell: props.id, name: props.name, amount: props.amount, storage: props.storage });
	}

	function onPointerDown(event: PointerEvent) {
		startDrag({ id: props.id, name: props.name, storage: props.storage }, event);
	}
</script>

<template>
	<div
		class="inventory_item"
		:id="`item-${id}`"
		@pointerdown="onPointerDown"
		@click="onClick"
	>
		<img :src="images.getImage(`${name}.png`, 'inventory')" :alt="name" />

		<span v-if="!hideAmount" class="inventory_item-amount">{{ amount }}</span>
	</div>
</template>
