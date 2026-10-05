<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import Title from '../partials/title.vue';
	import List from './list.vue';
	import Vehicle from './vehicle.vue';

	export type VehicleData = {
		id: string;
		model: string;
		govNumber: string;
		spawned: boolean;
	};

	const vehicles = ref<VehicleData[]>([]);
	const selectedVehicle = ref<VehicleData | undefined>(undefined);

	onMounted(() => {
		rpc.callServer('Vehicle-GetPlayerList').then((items: VehicleData[]) => {
			vehicles.value = items;
		});
	});

	function selectVehicle(vehicle?: VehicleData) {
		selectedVehicle.value = vehicle;
	}

	async function getVehiclePosition() {
		if (!selectedVehicle.value) return;

		try {
			await rpc.callServer('Vehicle-MarkPosition', selectedVehicle.value.id);

			showNotification('info', 'Местоположение ТС отмечено на карте');
		} catch (err: any) {
			showNotification('error', 'Сначала закажите данное ТС');
		}
	}

	async function spawnVehicle() {
		if (!selectedVehicle.value) return;

		try {
			const position = await rpc.callClient(
				'Vehicle-GetSpawnCoords',
				selectedVehicle.value.model
			);
			await rpc.callServer('Vehicle-DeliverForPlayer', [
				selectedVehicle.value.id,
				position
			]);

			showNotification('info', 'Ваше ТС скоро будет доставлено');
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}

	async function despawnVehicle() {
		if (!selectedVehicle.value) return;

		try {
			await rpc.callServer('Vehicle-DespawnItem', selectedVehicle.value.id);

			showNotification('info', 'Ожидайте эвакуации в ближайшее время.');
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}
</script>

<template>
	<div class="vehicles">
		<Vehicle
			v-if="selectedVehicle"
			:data="selectedVehicle"
			:get-position="getVehiclePosition"
			:spawn="spawnVehicle"
			:despawn="despawnVehicle"
			:close="() => selectVehicle()"
		/>

		<div v-else class="vehicles_main">
			<Title className="vehicles_main-title">Ваш транспорт</Title>

			<List :items="vehicles" :select-item="selectVehicle" />
		</div>
	</div>
</template>
