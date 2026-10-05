<script setup lang="ts">
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import Grid from './grid.vue';
	import Indicator from './indicator.vue';
	import { useStorageInventory, type StorageState } from '@/composables/use-storage-inventory';

	const types: { [name: string]: string } = {
		player: 'Гражданин',
		vehicle: 'Багажник',
		house: 'Сейф',
		faction: 'Склад'
	};

	const props = defineProps<{
		data: Partial<StorageState>;
	}>();

	const storage = useStorageInventory(() => props.data as StorageState);
	const { state } = storage;

	defineExpose({
		move: storage.move,
		separate: storage.separate,
		transfer: storage.transfer
	});
</script>

<template>
	<div class="inventory_storage">
		<div class="inventory_storage-container">
			<PrimaryTitle className="inventory_title">{{ types[state.name] }}</PrimaryTitle>

			<Grid
				:items="storage.getItemsForCells()"
				:start-index="0"
				:cells="state.cells > 30 ? state.cells : 30"
				:available="state.cells"
				:storage="state.name"
			/>
		</div>

		<Indicator
			type="weight"
			title="Вес хранилища"
			:current="state.weight.current"
			:max="state.weight.max"
		/>
	</div>
</template>
