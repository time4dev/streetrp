<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import prettify from '@/utils/prettify';
	import { useRotation } from '@/composables/use-rotation';
	import Selector from '@/components/Common/selector.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Hint from '@/components/Common/hint.vue';
	import Point from '@/components/Common/point.vue';
	import vehicles from '@/data/vehicles.json';
	import Info from './info.vue';
	import Spec from './spec.vue';
	import Color from './color.vue';

	type State = {
		type: string;
		prices: { [name: string]: number };
		selectedVeh: string;
		color: number[];
	};

	const state = reactive<State>({
		type: '',
		prices: {},
		color: [0, 0, 0],
		selectedVeh: ''
	});

	useRotation();

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;
		const { type, prices } = data as { type: string; prices: { [name: string]: number } };

		const keys = Object.keys(prices);

		state.type = type;
		state.prices = prices;
		selectVehicle(keys[0]);
	});

	function getNamesList(items: string[]) {
		const names: { [key: string]: string } = {};

		items.forEach((item) => {
			names[item] = (vehicles as any)[item];
		});

		return names;
	}

	function getVehicleName(model: string) {
		return (vehicles as any)[model];
	}

	async function selectVehicle(model: string) {
		await rpc.callClient('VehicleShop-SetVehicle', model);

		state.selectedVeh = model;
	}

	async function selectColor(color: number[]) {
		await rpc.callClient('VehicleShop-ChangeColor', [color]);

		state.color = color;
	}

	function startTestDrive() {
		rpc.callClient('VehicleShop-TestDrive', state.selectedVeh);
	}

	async function buy() {
		const { type, selectedVeh, color } = state;

		try {
			await rpc.callServer('VehicleShop-Buy', [type, selectedVeh, color]);

			showNotification(
				'success',
				'Вы успешно приобрели ТС, доставить его можно через приложение в телефоне'
			);
		} catch (err: any) {
			showNotification('error', err.msg);
		}
	}
</script>

<template>
	<div class="vehicle-shop">
		<Hint class-name="vehicle-shop_hint" action="exit">
			Нажмите, чтобы закрыть меню
		</Hint>

		<Info :model="state.selectedVeh" />
		<Spec :model="state.selectedVeh" />

		<Color :current="state.color" :select="selectColor" />

		<div class="vehicle-shop_main">
			<span class="vehicle-shop_price">
				<Point
					v-if="state.type === 'vip_shop'"
					class-name="vehicle-shop_price"
					:amount="state.prices[state.selectedVeh]"
				/>
				<template v-else>{{ prettify.price(state.prices[state.selectedVeh]) }}</template>
			</span>

			<Selector
				class-name="vehicle-shop_selector"
				:items="Object.keys(state.prices)"
				:value="state.selectedVeh"
				:custom-value="getVehicleName(state.selectedVeh)"
				@change="selectVehicle"
			/>

			<div class="vehicle-shop_buttons">
				<GradientButton color="purple" @click="startTestDrive">
					Тест-драйв
				</GradientButton>

				<GradientButton @click="buy">Купить</GradientButton>
			</div>
		</div>
	</div>
</template>
