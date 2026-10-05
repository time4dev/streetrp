<script setup lang="ts">
	import { computed, onBeforeUnmount, ref, watch } from 'vue';

	const props = defineProps<{
		duration: number;
	}>();

	const time = ref(0);

	let interval: ReturnType<typeof setInterval> | undefined;

	// legacy componentDidUpdate: (re)start the countdown when duration increases
	watch(
		() => props.duration,
		(duration, previous) => {
			if (duration > (previous ?? 0) && !interval) {
				interval = setInterval(decreaseTime, 1000);

				time.value = duration;
			}
		}
	);

	onBeforeUnmount(() => {
		if (interval) clearInterval(interval);
	});

	function decreaseTime() {
		if (time.value > 0) time.value -= 1;
		else if (interval) clearInterval(interval);
	}

	const value = computed(() => {
		const minutes = Math.floor(time.value / 60)
			.toString()
			.padStart(2, '0');
		const seconds = Math.floor(time.value % 60)
			.toString()
			.padStart(2, '0');

		return `${minutes}:${seconds}`;
	});
</script>

<template>
	<div class="death_timer">
		<div class="death_timer-container">
			<h3 class="death_timer-title">До госпитализации</h3>

			<span class="death_timer-value">{{ value }}</span>
		</div>
	</div>
</template>
