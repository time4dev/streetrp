<script setup lang="ts">
	import { computed, onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Selector from '@/components/Common/selector.vue';
	import vehicleList from '@/data/vehicles.json';
	import Spec from '../spec.vue';
	import Bottom from '../bottom.vue';

	type State = {
		vehicles: string[];
		selectedVehicle: string;

		model: string;
		govNumber: string;
		price: number;
		owners: number;
		seller: string;
		tuning: {
			armor: number;
			engine: number;
			brakes: number;
			transmission: number;
			turbo: number;
		};
	};

	const state = reactive<State>({
		vehicles: [],
		selectedVehicle: '',

		seller: '',
		price: 0,

		model: '',
		govNumber: '',
		owners: 0,
		tuning: {
			armor: 0,
			engine: 0,
			brakes: 0,
			transmission: 0,
			turbo: 0
		}
	});

	const customValue = computed(() => (vehicleList as Record<string, string>)[state.model]);

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);

		if (data.vehicles) selectVehicle(data.vehicles[0]);
	});

	async function selectVehicle(id: string) {
		const data = await rpc.callServer('VehicleTrade-GetData', id);

		if (data) Object.assign(state, data, { selectedVehicle: id });
	}

	function changePrice(value: number) {
		state.price = value;
	}

	function sell() {
		const { seller, selectedVehicle, vehicles, ...data } = state;

		if (!data.price || data.price <= 0) return;

		rpc.callClient('VehicleTrade-SendOffer', [selectedVehicle, data]);
	}

	function buy() {
		rpc.callClient('VehicleTrade-ConfirmOffer');
	}

	function refuse() {
		rpc.callClient('VehicleTrade-RefuseOffer');
	}
</script>

<template>
	<div class="trading trading--vehicle">
		<div class="trading_top">
			<PrimaryTitle class-name="trading_title">
				{{ `${state.seller ? 'Покупка' : 'Продажа'} ТС` }}
			</PrimaryTitle>

			<Selector
				class-name="trading_selector"
				:items="state.vehicles"
				:value="state.selectedVehicle"
				:custom-value="customValue"
				@change="selectVehicle"
			/>

			<div class="trading_info">
				<div class="trading_info-items">
					<p class="trading_info-item">
						Гос. номер: <b>{{ state.govNumber }}</b>
					</p>

					<p class="trading_info-item">
						Владельцев: <b>{{ state.owners }}</b>
					</p>
				</div>

				<Spec type="vehicle" :items="state.tuning" />
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
