<script setup lang="ts">
	import { computed, inject } from 'vue';
	import { IoIosLock } from '@/utils/icons';
	import { useDnd, dndState } from '@/composables/use-dnd';

	type InventoryContext = {
		onDrop: (item: number | string, cell: number, storage: string) => void;
		selectItem: (item?: any) => void;
		transferItem: (id: number, cell: number, storage: string) => void;
	};

	const props = withDefaults(
		defineProps<{
			id: number | string;
			blocked?: boolean;
			storage?: string;
			className?: string;
			// legacy allowed overriding the drop callback per cell (quick/character/drop-zone)
			onDrop?: (sourceId: number | string, targetId: number | string, storage: string) => void;
		}>(),
		{ blocked: false, storage: 'self' }
	);

	const context = inject<InventoryContext>('inventory-context')!;
	const { registerDrop } = useDnd();

	const key = computed(() => `${props.storage}:${props.id}`);

	registerDrop(key.value, (sourceId, targetId, storage) => {
		// legacy Cell.drop: cross-storage drops always go through transferItem
		const sourceStorage = dndState.item?.storage;

		if (sourceStorage !== undefined && sourceStorage !== props.storage) {
			context.transferItem(sourceId as number, targetId as number, props.storage);
			return;
		}

		const onDrop = props.onDrop ?? context.onDrop;

		onDrop(sourceId, targetId as number, storage);
	});

	const isOver = computed(() => dndState.item !== null && dndState.overKey === key.value);
</script>

<template>
	<div
		:class="[
			'inventory_cell',
			className,
			{ 'is-over': isOver, 'is-blocked': blocked }
		]"
		:data-dnd-key="key"
		:data-dnd-id="id"
		:data-dnd-storage="storage"
		:data-dnd-blocked="blocked ? 'true' : 'false'"
	>
		<IoIosLock v-if="blocked && !Boolean($slots.default)" />

		<slot v-else />
	</div>
</template>
