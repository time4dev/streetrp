import { onBeforeUnmount, ref, watch, type Ref } from 'vue';

// Port of animated-number-react: tweens the displayed number over `duration` ms
// whenever the source value changes (same easing as the Common/total-price.vue port).
export function useAnimatedNumber(source: Ref<number>, duration = 300) {
	const displayValue = ref(source.value);

	let raf: number | null = null;
	let startTimestamp: number | null = null;
	let from = source.value;

	watch(source, (target) => {
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
	});

	onBeforeUnmount(() => {
		if (raf) cancelAnimationFrame(raf);
	});

	return displayValue;
}
