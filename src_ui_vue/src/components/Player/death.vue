<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import Timer from './death/timer.vue';

	const duration = ref(0);
	const medics = ref(0);

	// legacy: componentDidMount -> setState(location.state)
	onMounted(() => {
		const state = history.state as { duration: number; medics: number };

		duration.value = state.duration;
		medics.value = state.medics;
	});

	function die() {
		rpc.callClient('Player-ClientDie');
	}

	function callMedic() {
		rpc
			.callServer('EmsCalls-Create')
			.then(() => showNotification('info', 'Ваш вызов был зарегистрирован'));
	}
</script>

<template>
	<div class="death">
		<div class="death_section death_section--danger">
			<PrimaryTitle class-name="death_title">Больница</PrimaryTitle>

			<div class="death_section-container">
				<button class="death_btn" @click="die">
					<span>Обморок</span>
				</button>

				<p class="death_descr">Вас доставят в ближайшую больницу</p>
			</div>
		</div>

		<Timer :duration="duration / 1000" />

		<div class="death_section death_section--safe">
			<PrimaryTitle class-name="death_title">Помощь</PrimaryTitle>

			<div class="death_section-container">
				<button class="death_btn" @click="callMedic">
					<span>Вызов</span>
				</button>

				<p class="death_descr">
					Для вызова доступно <b>{{ medics }}</b> медиков
				</p>
			</div>
		</div>
	</div>
</template>
