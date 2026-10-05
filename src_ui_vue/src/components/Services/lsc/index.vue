<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import { usePlayerStore } from '@/stores/player';
	import { useRotation } from '@/composables/use-rotation';
	import WithPayment from '@/components/Common/with-payment.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import Money from '@/components/HUD/money.vue';
	import Categories from './categories.vue';
	import Items from './items.vue';
	import Color from './color.vue';
	import Hints from './hints.vue';
	import { items as itemsData } from './data';
	import type { RGBColor } from './types';

	useRotation();

	const player = usePlayerStore();

	// module data is mutated in fetchCustomItems — make it reactive so the UI follows
	const items = reactive(itemsData);

	type State = typeof initialState & {
		activeCategory?: string;
		selectedItem?: number;
	};

	const initialState = {
		prices: {} as { [name: string]: number[] },
		installedItem: -1,
		color: { r: 0, g: 0, b: 0, a: 0 } as RGBColor,
		colorMenu: false,
		scrollPosition: 0
	};

	const state = reactive<State>({ ...initialState });

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);

		fetchCustomItems();
	});

	async function fetchCustomItems() {
		Object.entries(items).forEach(async ([name, data]) => {
			if (data.length) return;

			const amount: number = await rpc.callClient('LSC-GetModAmount', name);

			for (let index = 0; index <= amount; index++) {
				data.push(index ? 'custom' : 'default');
			}
		});
	}

	async function openCategory(name: string) {
		if (name !== 'repair' && items[name] && items[name].length <= 1) {
			return showNotification('error', 'Нет доступных деталей');
		}

		const installed: number = await rpc.callClient('LSC-SetCategory', name);

		state.activeCategory = name;
		state.installedItem = installed;
	}

	function toPrev() {
		state.selectedItem = undefined;
		state.activeCategory = undefined;
		state.colorMenu = false;
		state.color = { ...initialState.color };
	}

	function selectItem(id: number) {
		const { activeCategory } = state;

		if (!activeCategory) return;

		if (activeCategory === 'paint' || (activeCategory === 'neon' && id)) {
			state.colorMenu = true;
			state.selectedItem = id;
			state.color = { ...initialState.color };
		} else {
			state.selectedItem = id;
			state.colorMenu = false;
		}

		rpc.callClient('LSC-SetItem', id - 1);
	}

	function changeColor(color: RGBColor) {
		state.color = color;

		rpc.callClient('LSC-SetColor', [Object.values(color)]);
	}

	async function buy(payment: string) {
		const { activeCategory, selectedItem, color } = state;

		if (typeof selectedItem !== 'number') return;

		const data = {
			name: activeCategory,
			model: selectedItem,
			color: Object.values(color)
		};

		await rpc.callServer('LSC-Buy', [data, payment]);

		const installed: number = await rpc.callClient('LSC-GetInstalledItem', activeCategory);

		state.installedItem = installed;
	}

	function saveScrollPosition(value: number) {
		state.scrollPosition = value;
	}
</script>

<template>
	<WithPayment v-slot="{ showPayment }">
		<div class="lsc">
			<Hints />

			<div class="lsc_buttons">
				<OutlineButton
					class-name="lsc_buttons-item lsc_buttons-item--prev"
					:disabled="!state.activeCategory"
					@click="toPrev"
				>
					<span>Назад</span>
				</OutlineButton>

				<OutlineButton
					v-if="
						state.selectedItem !== undefined &&
						state.selectedItem - 1 !== state.installedItem
					"
					class-name="lsc_buttons-item"
					@click="showPayment(buy)"
				>
					<span>Купить</span>
				</OutlineButton>
				<OutlineButton
					v-else
					class-name="lsc_buttons-item"
					@click="rpc.callClient('LSC-CloseMenu')"
				>
					<span>Закрыть</span>
				</OutlineButton>
			</div>

			<Items
				v-if="state.activeCategory"
				:category="state.activeCategory"
				:items="items[state.activeCategory]"
				:prices="state.prices[state.activeCategory]"
				:selected="state.selectedItem"
				:installed="state.installedItem"
				:select="selectItem"
			/>
			<Categories
				v-else
				:current="state.activeCategory"
				:offset="state.scrollPosition"
				:open="openCategory"
				:on-scroll="saveScrollPosition"
			/>

			<Color
				v-if="state.colorMenu"
				:state="state.color"
				:custom="state.activeCategory === 'paint' && state.selectedItem === 2"
				:type-selector="
					state.activeCategory === 'paint' && [0, 1].includes(state.selectedItem ?? -1)
				"
				:on-change="changeColor"
			/>

			<Money :cash="player.money.cash" :bank="player.money.bank" />
		</div>
	</WithPayment>
</template>
