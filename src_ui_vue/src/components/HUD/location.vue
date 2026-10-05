<script setup lang="ts">
	import { onBeforeUnmount, onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';

	type Location = {
		street: string;
		zone: string;
		greenZone: boolean;
	};

	const state = reactive<Location>({
		street: 'Улица Роуб',
		zone: 'Ла Пуерта',
		greenZone: false
	});

	onMounted(() => {
		rpc.register('HUD-SetLocation', (data: Partial<Location>) => Object.assign(state, data));

		getCurrentLocation();
	});

	onBeforeUnmount(() => {
		rpc.unregister('HUD-SetLocation');
	});

	async function getCurrentLocation() {
		const location = await rpc.callClient('getPlayerLocation');

		Object.assign(state, location);
	}
</script>

<template>
	<div :class="['hud_location', { 'hud_location--green': state.greenZone }]">
		<h3 class="hud_location-street">{{ state.street }}</h3>
		<h4 class="hud_location-zone">{{ state.zone }}</h4>
	</div>
</template>
