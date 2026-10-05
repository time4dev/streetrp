<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import WithPayment from '@/components/Common/with-payment.vue';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import TotalPrice from '@/components/Common/total-price.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Products from './products.vue';
	import Quantity from './quantity.vue';

	type State = {
		prices: {
			[name: string]: number;
		};
		selectedProduct?: {
			name: string;
			amount: number;
		};
	};

	const state = reactive<State>({
		prices: {}
	});

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);
	});

	function selectProduct(name: string) {
		state.selectedProduct = { name, amount: 1 };
	}

	function changeAmountOfProduct(value: number) {
		if (state.selectedProduct) {
			state.selectedProduct = { ...state.selectedProduct, amount: value };
		}
	}

	function getTotalPrice() {
		const { prices, selectedProduct } = state;

		return selectedProduct ? selectedProduct.amount * prices[selectedProduct.name] : 0;
	}

	async function buy(payment: string) {
		const { selectedProduct } = state;

		if (!selectedProduct) return;

		await rpc.callServer('Supermarket-Buy', [selectedProduct, payment]);
		state.selectedProduct = undefined;
	}
</script>

<template>
	<WithPayment v-slot="{ showPayment }">
		<div class="supermarket">
			<div class="supermarket_container">
				<PrimaryTitle class-name="supermarket_title">Магазин 24/7</PrimaryTitle>

				<Products
					:items="state.prices"
					:selected="state.selectedProduct?.name"
					:select-item="selectProduct"
				/>
				<Quantity
					:value="state.selectedProduct?.amount ?? 0"
					:select="changeAmountOfProduct"
				/>
			</div>

			<div class="supermarket_footer">
				<OutlineButton is-close>Закрыть</OutlineButton>

				<TotalPrice
					class-name="supermarket_price"
					title-class-name="supermarket_price-title"
					:value="getTotalPrice()"
				/>

				<GradientButton @click="showPayment(buy)">Купить</GradientButton>
			</div>
		</div>
	</WithPayment>
</template>
