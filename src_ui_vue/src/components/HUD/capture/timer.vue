<script setup lang="ts">
	import { FaRegClock } from '@/utils/icons';
	import RcCircle from '@/components/Common/rc-circle.vue';

	defineProps<{
		current: number;
		max: number;
	}>();

	function secondsToTime(sec: number) {
		const m = Math.floor((sec % 3600) / 60)
			.toString()
			.padStart(2, '0');
		const s = Math.floor(sec % 60)
			.toString()
			.padStart(2, '0');

		return `${m}:${s}`;
	}
</script>

<template>
	<div class="capture_timer">
		<div class="capture_timer-circle">
			<RcCircle
				class-name="capture_timer-progress"
				:stroke-width="10"
				:trail-width="10"
				trail-color="#5D5D64"
				stroke-color="#fcda3f"
				stroke-linecap="square"
				:percent="(current * 100) / max"
			/>

			<FaRegClock class="capture_timer-icon" />
		</div>

		<span class="capture_timer-current">{{ secondsToTime(current) }}</span>
	</div>
</template>
