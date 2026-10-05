<script setup lang="ts">
	import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
	import Point from '@/components/Common/point.vue';

	const props = defineProps<{
		time: number;
	}>();

	const min = ref(0);
	const hour = ref(0);

	let progressInterval: ReturnType<typeof setInterval> | undefined;

	onMounted(() => runTimer(props.time));

	onBeforeUnmount(() => stopTimer());

	function runTimer(time?: number) {
		if (!time || time < 0) return;

		hour.value = Math.floor(time / 60);
		min.value = Math.floor(time % 60);

		progressInterval = setInterval(() => {
			if (hour.value === 0 && min.value === 0) return stopTimer();

			if (min.value > 0) min.value--;
			else if (hour.value > 0) {
				hour.value--;
				min.value = 59;
			}
		}, 60000);
	}

	function stopTimer() {
		if (progressInterval) {
			clearInterval(progressInterval);

			progressInterval = undefined;
		}
	}

	const bonusTime = computed(
		() =>
			`${hour.value.toString().padStart(2, '0')}:${min.value.toString().padStart(2, '0')}`
	);
</script>

<template>
	<div v-if="hour > 0 || min > 0" class="hud_bonus">
		<div class="hud_bonus-time">{{ bonusTime }}</div>

		<div class="hud_bonus-sum">
			<Point :amount="100" />
		</div>
	</div>
</template>
