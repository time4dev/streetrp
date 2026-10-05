<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import vehiclesList from '@/data/vehicles.json';
	import F7Page from '../../f7/page.vue';
	import F7Navbar from '../../f7/navbar.vue';
	import F7List from '../../f7/list.vue';
	import F7ListItem from '../../f7/list-item.vue';

	export type Vehicle = {
		id: number;
		model: string;
		govNumber: string;
	};

	const vehicles = ref<Vehicle[]>([]);

	onMounted(() => {
		rpc.callServer('Faction-GetVehicles').then((data: Vehicle[]) => (vehicles.value = data));
	});

	async function despawnVehicle(id: number) {
		await rpc.callServer('Factions-DespawnVehicle', id);
		vehicles.value = vehicles.value.filter((item) => item.id !== id);

		showNotification('info', 'Механик в ближайшее время эвакуирует данное ТС');
	}
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="Транспорт" />
		</template>

		<F7List media-list inset>
			<F7ListItem
				v-for="vehicle in vehicles"
				:key="vehicle.id"
				checkbox
				:title="(vehiclesList as any)[vehicle.model] ?? vehicle.model"
				:after="vehicle.govNumber"
				@change="despawnVehicle(vehicle.id)"
			/>
		</F7List>
	</F7Page>
</template>
