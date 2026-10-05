<script setup lang="ts">
	import { computed, onBeforeUnmount, ref, watch } from 'vue';
	import prettify from '@/utils/prettify';

	const props = withDefaults(
		defineProps<{
			value: number;
			formatter?: (value: number) => string;
			title?: string;
			className?: string;
			titleClassName?: string;
			valueClassName?: string;
		}>(),
		{}
	);

	// Port of animated-number-react: tweens the displayed value over 300ms.
	const duration = 300;
	const displayValue = ref(props.value);
	const elementClass = computed(() => ['total-price_value', props.valueClassName]);
	const formatted = computed(() => {
		const formatter = props.formatter ?? prettify.price;

		return formatter(displayValue.value);
	});

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
				const eased = 0.5 - Math.cos(progress * Math.PI) / 2; // easeInOutCubic-ish like the original

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
	<div :class="['total-price', className]">
		<h4 :class="['total-price_title', titleClassName]">{{ title || 'Итого:' }}</h4>

		<span :class="elementClass">{{ formatted }}</span>
	</div>
</template>
