<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import prettify from '@/utils/prettify';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Selector from '@/components/Common/selector.vue';
	import Bottom from '../bottom.vue';

	type State = {
		items: number[];
		selectedItem: number;

		price: number;
		seller: string;

		name: string;
		govPrice: number;
		income: number;
	};

	const state = reactive<State>({
		items: [],
		selectedItem: 0,

		price: 0,
		seller: '',

		name: '',
		govPrice: 0,
		income: 0
	});

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);

		selectItem(data.items[0]);
	});

	async function selectItem(index: number) {
		const data = await rpc.callServer('BusinessTrade-GetData', index);

		Object.assign(state, data, { selectedItem: index });
	}

	function changePrice(value: number) {
		state.price = value;
	}

	function sell() {
		const { price, selectedItem } = state;

		rpc.callClient('BusinessTrade-SendOffer', [selectedItem, price]);
	}

	function buy() {
		rpc.callClient('BusinessTrade-ConfirmOffer');
	}

	function refuse() {
		rpc.callClient('BusinessTrade-RefuseOffer');
	}
</script>

<template>
	<div class="trading trading--business">
		<div class="trading_top">
			<PrimaryTitle class-name="trading_title">
				{{ `${state.seller ? 'Покупка' : 'Продажа'} бизнеса` }}
			</PrimaryTitle>

			<Selector
				class-name="trading_selector"
				:items="state.items"
				:value="state.selectedItem"
				:custom-value="state.name"
				@change="selectItem"
			/>

			<div class="trading_info">
				<div class="trading_info-items">
					<p class="trading_info-item">
						Гос. цена: <b>{{ prettify.price(state.govPrice) }}</b>
					</p>
					<p class="trading_info-item">
						Доход: <b>{{ prettify.price(state.income) }}</b>
					</p>
				</div>
			</div>
		</div>

		<Bottom :seller="state.seller" :price="state.price" :set-price="changePrice" />

		<div class="trading_footer">
			<OutlineButton @click="refuse">Закрыть</OutlineButton>

			<GradientButton v-if="state.seller" @click="buy">Купить</GradientButton>
			<GradientButton v-else @click="sell">Предложить</GradientButton>
		</div>
	</div>
</template>
