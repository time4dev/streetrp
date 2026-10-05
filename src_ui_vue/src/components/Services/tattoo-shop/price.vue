<script setup lang="ts">
	import { computed, onBeforeUnmount, ref, watch } from 'vue';
	import prettify from '@/utils/prettify';

	// Port of animated-number-react: tweens the displayed value over 300ms
	// (the shared port lives in Common/total-price.vue, this one keeps the
	// original single <span> DOM with the tattoo-shop class).
	const props = defineProps<{
		value: number;
	}>();

	const duration = 300;
	const displayValue = ref(props.value);
	const formatted = computed(() => prettify.price(displayValue.value));

	let raf: number | null = null;
	let startTimestamp: number | null = null;
	let from = props.value;

	watch(
		() => props.value,
		(target) => {
			if (raf) cancelAnimationFrame(raf);

			from = displayValue.value;
			startTimestamp = null;

			const step = (timestamp: number) => {
				if (startTimestamp === null) startTimestamp = timestamp;

				const progress = Math.min((timestamp - startTimestamp) / duration, 1);
				const eased = 0.5 - Math.cos(progress * Math.PI) / 2;

				displayValue.value = from + (target - from) * eased;

				if (progress < 1) raf = requestAnimationFrame(step);
				else displayValue.value = target;
			};

			raf = requestAnimationFrame(step);
		}
	);

	onBeforeUnmount(() => {
		if (raf) cancelAnimationFrame(raf);
	});
</script>

<template>
	<span class="tattoo-shop_price">{{ formatted }}</span>
</template>
