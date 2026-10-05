<script setup lang="ts">
	import { ref, watch } from 'vue';
	import RcCircle from '@/components/Common/rc-circle.vue';
	import Selector from '@/components/Common/selector.vue';

	const props = defineProps<{
		current: number;
		progress: number;
	}>();

	const emit = defineEmits<{ 'select-level': [level: number] }>();

	const levels = ref<number[]>([]);

	// Legacy: useEffect([current, levels.length])
	watch(
		[() => props.current, () => levels.value.length],
		([current, length]) => {
			if (current > length) levels.value = [...Array(current + 1).keys()];
		},
		{ immediate: true }
	);

	function selectLevel(level: number) {
		emit('select-level', level);
	}
</script>

<template>
	<div class="job_level">
		<div class="job_level-current">
			<Selector
				class-name="job_selector"
				:items="levels"
				:value="current"
				:custom-value="`${current + 1}`"
				@change="selectLevel"
			/>

			<span>уровень</span>
		</div>

		<RcCircle
			class-name="job_level-progress"
			:stroke-width="4"
			:trail-width="4"
			trail-color="#fff"
			stroke-color="#ff0082"
			stroke-linecap="square"
			:percent="progress"
		/>
	</div>
</template>
