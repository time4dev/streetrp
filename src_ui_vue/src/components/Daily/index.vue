<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import { usePlayerStore } from '@/stores/player';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import News from './news/index.vue';
	import Bonus from './bonus.vue';
	import Stats from './stats.vue';
	import Tasks from './tasks.vue';

	type DailyState = {
		experience: [number, number];
		level: number;
		name: string;
		day: number;
		tasks: {
			[name: string]: number[];
		};
		news: string;
		bonuses: number[];
	};

	const player = usePlayerStore();

	const state = reactive<DailyState>({
		experience: [0, 0],
		level: 0,
		name: '',
		day: 0,
		tasks: {},
		news: 'update',
		bonuses: [1000, 2000, 3000, 4000, 5000, 6000, 7000]
	});

	onMounted(() => {
		rpc.callServer('Daily-GetData').then((data) => Object.assign(state, data));
	});

	async function getBonus() {
		await rpc.callServer('Daily-GetAward');

		state.day = -1;
	}
</script>

<template>
	<div class="daily">
		<p class="daily_username">{{ state.name }}</p>

		<div class="daily_container">
			<News :type="state.news" />

			<div class="daily_info">
				<Stats
					:money="player.money.points"
					:level="state.level"
					:experience="state.experience"
				/>
				<Tasks :items="state.tasks" />
			</div>
		</div>

		<div class="daily_footer">
			<Bonus :current="state.day" :items="state.bonuses" />

			<div class="daily_buttons">
				<GradientButton :disabled="state.day < 0" @click="getBonus">
					Забрать
				</GradientButton>

				<OutlineButton @click="rpc.callServer('Spawn-ShowMenu')">
					Закрыть
				</OutlineButton>
			</div>
		</div>
	</div>
</template>
