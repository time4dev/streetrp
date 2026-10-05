<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import TotalPrice from '@/components/Common/total-price.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import vehicleList from '@/data/vehicles.json';

	type State = {
		model: string;
		price: number;
	};

	const state = reactive<State>({
		model: '',
		price: 0
	});

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);
	});

	async function recycleVehicle() {
		await rpc.callServer('VehicleDump-Recycle');
		rpc.callClient('Browser-HidePage');
	}

	function getVehicleName(model: string) {
		return (vehicleList as any)[model] || model;
	}
</script>

<template>
	<div class="vehicle-dump">
		<PrimaryTitle class-name="vehicle-dump_title">Утилизация ТС</PrimaryTitle>

		<div class="vehicle-dump_container">
			<div class="vehicle-dump_info">
				<div class="vehicle-dump_info-item">
					Марка и модель: <b>{{ getVehicleName(state.model) }}</b>
				</div>
			</div>

			<TotalPrice class-name="vehicle-dump_price" title="Получите:" :value="state.price" />
		</div>

		<div class="vehicle-dump_footer">
			<OutlineButton is-close>Отмена</OutlineButton>
			<GradientButton @click="recycleVehicle">Подтвердить</GradientButton>
		</div>
	</div>
</template>
