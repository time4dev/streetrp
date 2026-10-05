<script setup lang="ts">
	import vehiclesData from '@/data/vehicles.json';
	import Button from '../partials/button.vue';
	import Group from '../partials/group.vue';
	import type { VehicleData } from './index.vue';

	defineProps<{
		items: VehicleData[];
		selectItem: (vehicle: VehicleData) => void;
	}>();
</script>

<template>
	<Group className="vehicles_list">
		<Button
			v-for="(item, index) in items"
			:key="index"
			:on-click="() => selectItem(item)"
		>
			{{ (vehiclesData as any)[item.model] ?? item.model }}
		</Button>
	</Group>
</template>
