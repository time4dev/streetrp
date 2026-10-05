<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Selector from '@/components/Common/selector.vue';
	import Spec from '../spec.vue';
	import Bottom from '../bottom.vue';

	const types = ['low', 'average', 'premium'];

	type State = {
		houses: number[];
		selectedHouse: number;

		price: number;
		seller: string;

		type: string;
		garage: number;
		safe: number;
		govPrice: number;
	};

	const state = reactive<State>({
		houses: [],
		selectedHouse: 0,

		seller: '',
		price: 0,

		type: 'low',
		govPrice: 0,
		garage: 0,
		safe: 0
	});

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);

		selectHouse(data.houses[0]);
	});

	async function selectHouse(index: number) {
		const data = await rpc.callServer('HouseTrade-GetData', index);

		Object.assign(state, data, { selectedHouse: index });
	}

	function changePrice(value: number) {
		state.price = value;
	}

	function sell() {
		const { price, selectedHouse } = state;

		rpc.callClient('HouseTrade-SendOffer', [selectedHouse, price]);
	}

	function buy() {
		rpc.callClient('HouseTrade-ConfirmOffer');
	}

	function refuse() {
		rpc.callClient('HouseTrade-RefuseOffer');
	}
</script>

<template>
	<div class="trading trading--house">
		<div class="trading_top">
			<PrimaryTitle class-name="trading_title">
				{{ `${state.seller ? 'Покупка' : 'Продажа'} дома` }}
			</PrimaryTitle>

			<Selector
				class-name="trading_selector"
				:items="state.houses"
				:value="state.selectedHouse"
				:custom-value="`Дом №${state.selectedHouse}`"
				@change="selectHouse"
			/>

			<div class="trading_info">
				<div class="trading_info-items">
					<p class="trading_info-item">
						Гос. цена: <b>{{ state.govPrice }}$</b>
					</p>
				</div>

				<Spec
					type="house"
					:items="{
						star: types.indexOf(state.type.split('_')[0]) + 1,
						garage: state.garage,
						safe: state.safe
					}"
				/>
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
