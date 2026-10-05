<script setup lang="ts">
	import { computed, onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import images from '@/utils/images';
	import { showNotification } from '@/utils/notifications';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Level from './level.vue';
	import Info from './info.vue';
	import jobs from './data';

	type State = {
		name: string;
		level: number;
		progress: number;
		isWorking: boolean;
		selectedLevel: number;
	};

	const state = reactive<State>({
		name: 'waterfront',
		level: 0,
		progress: 0,
		selectedLevel: 0,
		isWorking: false
	});

	const name = computed(() => state.name.toLowerCase());
	const data = computed(() => jobs[name.value]);
	const background = computed(() => `url(${images.getImage(`${name.value}.jpg`, 'jobs')})`);

	// Legacy: componentDidMount -> setState(location.state)
	onMounted(() => {
		if (!history.state) return;

		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...pageData } =
			history.state as Record<string, any>;

		Object.assign(state, pageData);
	});

	function selectLevel(level: number) {
		if (state.level < level) return;

		state.selectedLevel = level;
	}

	async function startWork() {
		const { name, selectedLevel } = state;

		try {
			await rpc.callServer('Jobs-StartWork', [name, selectedLevel]);
			closeMenu();
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}

	function finishWork() {
		rpc.callClient('Job-FinishWork').then(closeMenu);
	}

	function closeMenu() {
		rpc.callClient('Browser-HidePage');
	}
</script>

<template>
	<div class="job" :style="{ backgroundImage: background }">
		<div class="job_container">
			<div class="job_main">
				<PrimaryTitle class-name="job_main-title">Работа</PrimaryTitle>
				<h3 class="job_main-name">{{ data.title }}</h3>

				<Level
					:current="state.selectedLevel"
					:progress="state.selectedLevel < state.level ? 100 : state.progress"
					@select-level="selectLevel"
				/>
			</div>

			<Info :requirements="data.requirements" :description="data.description" />

			<div class="job_footer">
				<OutlineButton is-close>Закрыть</OutlineButton>

				<GradientButton @click="state.isWorking ? finishWork() : startWork()">
					{{ state.isWorking ? 'Уволиться' : 'Устроиться' }}
				</GradientButton>
			</div>
		</div>
	</div>
</template>
