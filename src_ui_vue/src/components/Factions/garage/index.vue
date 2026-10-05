<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import { showNotification } from '@/utils/notifications';
	import rpc from '@/utils/rpc';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import List from './list.vue';

	type State = {
		selectedVehicle?: string;
		vehicles: string[];
	};

	const state = reactive<State>({
		vehicles: []
	});

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);
	});

	function selectVehicle(model: string) {
		state.selectedVehicle = model;
	}

	async function spawnVehicle() {
		const { selectedVehicle } = state;

		if (!selectedVehicle) return;

		try {
			await rpc.callServer('Factions-SpawnVehicle', selectedVehicle);
			showNotification('success', 'ТС успешно доставлено');
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}
</script>

<template>
	<div class="faction-garage">
		<PrimaryTitle class-name="faction-garage_title">Гараж</PrimaryTitle>

		<div class="faction-garage_container">
			<List :selected="state.selectedVehicle" :items="state.vehicles" @select="selectVehicle" />
		</div>

		<div class="faction-garage_footer">
			<OutlineButton is-close>Закрыть</OutlineButton>
			<GradientButton @click="spawnVehicle">Доставить</GradientButton>
		</div>
	</div>
</template>
