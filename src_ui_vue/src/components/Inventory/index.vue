<script setup lang="ts">
	import { computed, provide, ref } from 'vue';
	import { capitalize, isString } from 'lodash-es';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import { usePlayerStore } from '@/stores/player';
	import { useStorageInventory } from '@/composables/use-storage-inventory';
	import Hints from './hints.vue';
	import Pockets from './pockets.vue';
	import Backpack from './backpack.vue';
	import Indicator from './indicator.vue';
	import Selected from './selected.vue';
	import Separate from './separate.vue';
	import Preview from './preview.vue';
	import CharacterEquipment from './character.vue';
	import Storage from './storage.vue';

	export type InventoryItem = {
		name: string;
		amount: number;
		cell: number;
	};

	const player = usePlayerStore();

	const storage = useStorageInventory(() => undefined);
	const { state } = storage;

	const showSeparate = ref(false);
	const selectedItem = ref<(InventoryItem & { storage: string }) | null>(null);
	const storageRef = ref<InstanceType<typeof Storage>>();

	function selectItem(item?: InventoryItem & { storage: string }) {
		if (item && (item.cell as number) < 0) return;

		selectedItem.value = item && (item.cell as number) >= 0 ? item : null;
	}

	function toggleSeparate() {
		showSeparate.value = !showSeparate.value;
	}

	async function useItem(cell: number) {
		if (isString(cell) || (cell as number) < 0) return;

		try {
			const data = await rpc.callServer('Inventory-Use', cell);

			selectItem();

			storage.setItems(
				data.item
					? state.items.map((item) => (item.cell === cell ? data.item : item))
					: state.items.filter((item) => item.cell !== cell)
			);
			storage.setWeight(data.weight);

			if (data.equipment) {
				storage.setEquipment({ ...state.equipment, [data.equipment]: data.item });
			}
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}

	async function toQuickSlot(cell: number, slot: string) {
		const equipedItem = await rpc.callServer('Inventory-ToQuick', [cell, slot]);

		storage.setItems(state.items.filter((item) => item.cell !== cell));
		storage.setEquipment({ ...state.equipment, [slot]: equipedItem });
	}

	async function unequipItem(slot: string, cell: number) {
		const item = state.equipment[slot];

		if (!item) return;

		try {
			const itemCell: number = await rpc.callServer('Inventory-UnequipItem', [slot, cell]);

			storage.setEquipment({ ...state.equipment, [slot]: undefined } as any);
			storage.setItems([...state.items, { ...item, cell: itemCell }]);
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}

	function moveItem(id: number | string, cell: number, storageName: string) {
		if (selectedItem.value || id === cell) return;

		if (isString(id)) return unequipItem(id as string, cell);

		if (storageName !== state.name && storageRef.value) {
			storageRef.value.move(id, cell);
		} else storage.move(id, cell);
	}

	function separateItem(amount: number) {
		const target = selectedItem.value;

		if (!target || amount >= target.amount) return;

		if (target.storage !== state.name && storageRef.value) {
			storageRef.value.separate(target, amount);
		} else storage.separate(target, amount);

		selectItem();
		toggleSeparate();
	}

	async function dropItem(id: number | string) {
		const weight: number = await rpc.callServer('Inventory-Drop', id);

		if (isString(id)) {
			storage.setEquipment({ ...state.equipment, [id as string]: undefined } as any);
		} else storage.setItems(state.items.filter((item) => item.cell !== id));

		storage.setWeight(weight);
	}

	async function transferItem(id: number, cell: number, storageName: string) {
		if (selectedItem.value || !storageRef.value) return;

		try {
			const { storage: storageState } = history.state as { storage: { name: string } };
			const inside = storageState.name === storageName;

			const data: {
				item: InventoryItem;
				weight: number[];
			} = await rpc.callServer(`Inventory-${capitalize(storageState.name)}Transfer`, [
				inside,
				id,
				cell
			]);

			storage.transfer(id, data.weight[1], !inside ? data.item : undefined);
			storageRef.value.transfer(id, data.weight[0], inside ? data.item : undefined);
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}

	// legacy React context (context.ts)
	provide('inventory-context', {
		onDrop: moveItem,
		selectItem,
		transferItem
	});

	const items = computed(() => storage.getItemsForCells());
	const storageState = computed(
		() => (history.state as { storage?: { name: string } } | undefined)?.storage
	);
</script>

<template>
	<div class="inventory">
		<Hints />

		<div class="inventory_container">
			<Pockets :items="items" />
			<Backpack :items="items" :cells="state.cells" />

			<div class="inventory_indicators">
				<Indicator
					type="weight"
					title="Вес инвентаря"
					:current="state.weight.current"
					:max="state.weight.max"
				/>

				<Indicator type="satiety" title="Cытость" :current="player.satiety" :max="100" />
			</div>
		</div>

		<Storage v-if="storageState" ref="storageRef" :data="storageState" />

		<template v-else>
			<Quick :items="state.equipment" :equip="toQuickSlot" />

			<CharacterEquipment :items="state.equipment" :use="useItem" :drop="dropItem" />
		</template>

		<Separate
			v-if="showSeparate && selectedItem"
			:amount="selectedItem.amount"
			:confirm="separateItem"
			:cancel="toggleSeparate"
		/>

		<Selected
			v-else-if="selectedItem"
			:id="selectedItem.cell"
			:name="selectedItem.name"
			:use="selectedItem.storage === state.name ? useItem : undefined"
			:separate="toggleSeparate"
			:close="() => selectItem()"
		/>

		<Preview />
	</div>
</template>
