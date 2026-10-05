<script setup lang="ts">
	import vehiclesData from '@/data/vehicles.json';
	import Navigation from '../partials/navigation.vue';
	import Button from '../partials/button.vue';
	import Group from '../partials/group.vue';
	import type { VehicleData } from './index.vue';

	defineProps<{
		data: VehicleData;

		getPosition: () => void;
		spawn: () => void;
		despawn: () => void;
		close: () => void;
	}>();
</script>

<template>
	<div class="vehicles_vehicle">
		<Navigation :close="{ title: 'Транспорт', onClick: close }" />

		<Group className="vehicles_vehicle-info">
			<Button :current="(vehiclesData as any)[data.model] ?? data.model">Имя</Button>
			<Button :current="data.govNumber || 'Отсутствует'">Гос. номер</Button>
		</Group>

		<Group className="vehicles_vehicle-actions">
			<Button color="blue" :on-click="spawn">Доставить за 80$</Button>

			<Button v-if="data.spawned" color="red" :on-click="despawn">Эвакуировать</Button>

			<Button color="blue" :on-click="getPosition">Получить геопозицию</Button>
		</Group>
	</div>
</template>
