<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import { useRotation } from '@/composables/use-rotation';
	import WithPayment from '@/components/Common/with-payment.vue';
	import Selector from '@/components/Common/selector.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Hint from '@/components/Common/hint.vue';
	import Categories from './categories.vue';
	import Price from './price.vue';

	useRotation();

	type State = {
		activeCategory: string;
		items: number;
		currentItem: number;
		prices: { [name: string]: number };
		isExists: boolean;
	};

	const state = reactive<State>({
		activeCategory: 'head',
		items: 0,
		currentItem: 0,
		prices: {},
		isExists: false
	});

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);

		setCategory(state.activeCategory);
	});

	async function setCategory(name: string) {
		const data = await rpc.callClient('TattooShop-ChangeType', name);

		Object.assign(state, { activeCategory: name, currentItem: 0, ...data });
	}

	async function changeItem(index: number) {
		const isExists: boolean = await rpc.callClient('TattooShop-SetItem', index);

		state.currentItem = index;
		state.isExists = isExists;
	}

	async function buy(payment: string) {
		await rpc.callClient('TattooShop-Buy', payment);

		state.isExists = true;
	}

	async function remove(payment: string) {
		await rpc.callClient('TattooShop-Remove', payment);

		state.isExists = false;
	}
</script>

<template>
	<WithPayment v-slot="{ showPayment }">
		<div class="tattoo-shop">
			<Hint class-name="tattoo-shop_hint" action="drag">Поворот персонажа</Hint>

			<div class="tattoo-shop_container">
				<Categories :current="state.activeCategory" :set-category="setCategory" />

				<div class="tattoo-shop_main">
					<Selector
						class-name="tattoo-shop_selector"
						:value="state.currentItem"
						:items="[...Array(state.items).keys()]"
						@change="changeItem"
					/>

					<Price :value="state.prices[state.activeCategory]" />
				</div>
			</div>

			<div class="tattoo-shop_buttons">
				<GradientButton v-if="state.isExists" color="purple" @click="showPayment(remove)">
					Удалить
				</GradientButton>
				<GradientButton v-else @click="showPayment(buy)">Купить</GradientButton>

				<OutlineButton @click="rpc.callClient('TattooShop-CloseMenu')">Закрыть</OutlineButton>
			</div>
		</div>
	</WithPayment>
</template>
