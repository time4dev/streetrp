import { onBeforeUnmount, onMounted, reactive } from 'vue';
import rpc from '@/utils/rpc';
import { showNotification } from '@/utils/notifications';
import type { InventoryItem } from '@/components/Inventory/index.vue';

export type StorageState = {
	name: string;
	items: InventoryItem[];
	cells: number;
	equipment: { [name: string]: InventoryItem };
	weight: {
		current: number;
		max: number;
	};
};

const VUE_ROUTER_KEYS = ['back', 'current', 'forward', 'replaced', 'position', 'scroll'];

/**
 * Port of the legacy `withStorage` HOC: owns the state of one inventory
 * (the player's own inventory or an external storage), initialised from
 * the route state (legacy `location.state`) or from the `data` prop.
 */
export function useStorageInventory(getData: () => StorageState | undefined) {
	const state = reactive<StorageState>({
		name: 'self',
		items: [],
		equipment: {},
		cells: 0,
		weight: {
			current: 0,
			max: 0
		}
	});

	function assign(data: Partial<StorageState> | undefined) {
		if (!data) return;

		if ('name' in data) state.name = data.name ?? 'self';
		if ('items' in data) state.items = data.items ?? [];
		if ('equipment' in data) state.equipment = data.equipment ?? {};
		if ('cells' in data) state.cells = data.cells ?? 0;
		if ('weight' in data) state.weight = data.weight ?? { current: 0, max: 0 };
	}

	function setItems(items: InventoryItem[]) {
		state.items = items;
	}

	function onChangeCapacity(cells: number, maxWeight: number) {
		state.cells = cells;
		state.weight.max = maxWeight;
	}

	function getItemsForCells(): InventoryItem[] {
		const data: InventoryItem[] = [];

		state.items.forEach((item) => {
			if (item.cell >= 0) data[item.cell] = item;
		});

		return data;
	}

	function setWeight(value: number) {
		state.weight.current = value;
	}

	function setEquipment(data: { [name: string]: InventoryItem }) {
		state.equipment = data;
	}

	async function move(id: number, cell: number) {
		try {
			const items: InventoryItem[] = await rpc.callServer(
				`Inventory-${state.name.charAt(0).toUpperCase()}${state.name.slice(1)}Move`,
				[id, cell]
			);

			state.items = items;
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}

	async function separate(target: InventoryItem, amount: number) {
		try {
			const { cell } = target;
			const data: InventoryItem = await rpc.callServer(
				`Inventory-${state.name.charAt(0).toUpperCase()}${state.name.slice(1)}Separate`,
				[cell, amount]
			);

			state.items = [
				...state.items.map((item) =>
					item.cell === cell ? { ...item, amount: item.amount - amount } : item
				),
				data
			];
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}

	function transfer(id: number, weight: number, data?: InventoryItem) {
		setWeight(weight);

		if (data) {
			const isExists = !!state.items.find((item) => item.cell === data.cell);

			setItems(
				isExists
					? state.items.map((item) => (item.cell === data.cell ? data : item))
					: [...state.items, data]
			);
		} else setItems(state.items.filter((item) => item.cell !== id));
	}

	onMounted(() => {
		// legacy: if (location.state) { const { storage, ...data } = state; setState(data) }
		const routeState = history.state as Record<string, unknown> | undefined;

		if (routeState && Object.keys(routeState).length) {
			const data: Record<string, unknown> = {};

			for (const [key, value] of Object.entries(routeState)) {
				if (key !== 'storage' && !VUE_ROUTER_KEYS.includes(key)) data[key] = value;
			}

			assign(data as Partial<StorageState>);
		} else {
			assign(getData());
		}

		rpc.register('Inventory-SetCapacity', onChangeCapacity);
	});

	onBeforeUnmount(() => {
		rpc.unregister('Inventory-SetCapacity');
	});

	return {
		state,
		setItems,
		setWeight,
		setEquipment,
		getItemsForCells,
		move,
		separate,
		transfer
	};
}
