<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import WithPayment from '@/components/Common/with-payment.vue';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import TotalPrice from '@/components/Common/total-price.vue';
	import Current from './current.vue';
	import Input from './input.vue';

	type State = {
		type: string;
		fuel: {
			current: number;
			max: number;
		};
		basket: {
			[name: string]: number;
		};
		prices: {
			[name: string]: number;
		};
	};

	const products: { [name: string]: string } = {
		fuel: 'Топливо',
		jerrycan: 'Канистра',
		repair_kit: 'Рем. комплект'
	};

	const state = reactive<State>({
		type: 'low',
		fuel: {
			current: 0,
			max: 0
		},
		basket: {},
		prices: {}
	});

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, { ...data, basket: getEmptyBasket() });
	});

	function changeBasketItem(name: string, amount: number) {
		state.basket = { ...state.basket, [name]: amount };
	}

	function getEmptyBasket() {
		const basket: { [name: string]: number } = {};

		Object.keys(products).forEach((name) => {
			basket[name] = 0;
		});

		return basket;
	}

	function getTotalPrice() {
		const { prices, basket } = state;
		const price = Object.entries(basket).reduce(
			(sum, [name, amount]) => sum + amount * (prices[name] ?? 0),
			0
		);

		return price;
	}

	async function buy(payment: string) {
		const { fuel, basket } = state;

		await rpc.callServer('Gas-Buy', [basket, payment]);

		state.basket = getEmptyBasket();
		state.fuel = { ...fuel, current: fuel.current + (basket.fuel || 0) };
	}
</script>

<template>
	<WithPayment v-slot="{ showPayment }">
		<div class="gas">
			<Current :percent="(state.fuel.current * 100) / state.fuel.max || 0" :type="state.type" />

			<div class="gas_main">
				<PrimaryTitle class-name="gas_main-title">Заправка</PrimaryTitle>

				<div class="gas_fields">
					<div v-for="(name, key) in products" :key="key" class="gas_fields-item">
						<div class="header">
							<span class="header_name">{{ name }}</span>
							<span class="header_price">{{ state.prices[key] }} $</span>
						</div>

						<Input
							:value="state.basket[key]"
							:min="0"
							:max="key === 'fuel' ? state.fuel.max - state.fuel.current : 20"
							@change="changeBasketItem(key, $event)"
						/>
					</div>
				</div>

				<TotalPrice class-name="gas_price" :value="getTotalPrice()" />

				<div class="gas_buttons">
					<OutlineButton @click="rpc.callClient('Gas-CloseMenu')">Закрыть</OutlineButton>

					<GradientButton @click="showPayment(buy)">Купить</GradientButton>
				</div>
			</div>
		</div>
	</WithPayment>
</template>
