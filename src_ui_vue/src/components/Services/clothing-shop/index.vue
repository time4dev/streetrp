<script setup lang="ts">
	import { onBeforeUnmount, onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import { useRotation } from '@/composables/use-rotation';
	import WithPayment from '@/components/Common/with-payment.vue';
	import Selector from '@/components/Common/selector.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Categories from './categories.vue';
	import Color from './color.vue';
	import Price from './price.vue';
	import Hint from './hint.vue';

	useRotation();

	type State = {
		activeCategory: string;
		items: number;
		colors: number;
		currentItem: number;
		currentColor: number;
		price: number;
	};

	const state = reactive<State>({
		activeCategory: 'hat',
		items: 0,
		colors: 1,
		currentItem: 0,
		currentColor: 0,
		price: 0
	});

	function setClothesData(data: { price: number; colors: number }) {
		state.price = data.price;
		state.colors = data.colors;
	}

	onMounted(() => {
		rpc.register('ClothingShop-SetData', setClothesData);

		setCategory(state.activeCategory);
	});

	onBeforeUnmount(() => {
		rpc.unregister('ClothingShop-SetData');
	});

	async function setCategory(name: string) {
		const amount: number = await rpc.callClient('ClothingShop-ChangeType', name);

		state.activeCategory = name;
		state.items = amount;
		state.currentItem = 0;
		state.currentColor = 0;
	}

	async function changeItem(index: number) {
		state.currentItem = index;
		state.currentColor = 0;

		await rpc.callClient('ClothingShop-ChangeItem', [index, 0, true]);
	}

	async function changeСolor(index: number) {
		state.currentColor = index;

		await rpc.callClient('ClothingShop-ChangeItem', [state.currentItem, index]);
	}

	async function buy(payment: string) {
		const { activeCategory, currentItem, currentColor } = state;

		const data = {
			type: activeCategory,
			index: currentItem,
			color: currentColor
		};

		await rpc.callServer('ClothingShop-Buy', [data, payment]);
	}
</script>

<template>
	<WithPayment v-slot="{ showPayment }">
		<div class="clothing-shop">
			<Hint />

			<Categories :current="state.activeCategory" :set-category="setCategory" />

			<div class="clothing-shop_container">
				<div class="clothing-shop_main">
					<Selector
						class-name="clothing-shop_selector"
						:value="state.currentItem"
						:items="[...Array(state.items).keys()]"
						@change="changeItem"
					/>

					<Color
						:current="state.currentColor"
						:amount="state.colors"
						:set-color="changeСolor"
					/>

					<Price :value="state.price" />
				</div>

				<div class="clothing-shop_buttons">
					<GradientButton @click="showPayment(buy)">Купить</GradientButton>

					<OutlineButton @click="rpc.callClient('ClothingShop-CloseMenu')">
						Закрыть
					</OutlineButton>
				</div>
			</div>
		</div>
	</WithPayment>
</template>
