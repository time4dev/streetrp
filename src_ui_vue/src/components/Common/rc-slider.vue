<script setup lang="ts">
	import { computed, ref } from 'vue';

	// Faithful port of rc-slider@8 (single handle, horizontal, no marks/dots).
	// Renders the exact DOM/classes of the original so vendor CSS keeps working.
	const props = withDefaults(
		defineProps<{
			value: number;
			min?: number;
			max?: number;
			step?: number;
			disabled?: boolean;
			prefixCls?: string;
			className?: string;
		}>(),
		{
			min: 0,
			max: 100,
			step: 1,
			disabled: false,
			prefixCls: 'rc-slider',
			className: ''
		}
	);

	const emit = defineEmits<{ change: [value: number] }>();

	const sliderRef = ref<HTMLElement>();
	const dragging = ref(false);

	const offsetPercent = computed(() => {
		const range = props.max - props.min;

		return range === 0 ? 0 : ((props.value - props.min) / range) * 100;
	});

	function align(value: number) {
		const { min, max, step } = props;
		let clamped = Math.min(Math.max(value, min), max);

		if (step) {
			const closestStep = Math.round((clamped - min) / step) * step + min;

			clamped = Math.min(Math.max(closestStep, min), max);

			// fix floating point precision like the original does
			const precision =
				Number.parseInt(`${step}`, 10) === Number(step)
					? 0
					: `${step}`.split('.')[1]?.length ?? 0;

			clamped = Number(clamped.toFixed(precision));
		}

		return clamped;
	}

	function calcValueByPosition(clientX: number) {
		const rect = sliderRef.value?.getBoundingClientRect();

		if (!rect || rect.width === 0) return props.value;

		const position = clientX - rect.left;
		const ratio = Math.min(Math.max(position / rect.width, 0), 1);

		return props.min + ratio * (props.max - props.min);
	}

	function onSliderMouseDown(event: MouseEvent) {
		if (props.disabled) return;

		const value = align(calcValueByPosition(event.clientX));

		if (value !== props.value) emit('change', value);

		dragging.value = true;

		const onMouseMove = (moveEvent: MouseEvent) => {
			const next = align(calcValueByPosition(moveEvent.clientX));

			if (next !== props.value) emit('change', next);
		};

		const onMouseUp = () => {
			dragging.value = false;

			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
		};

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	}

	function onKeyDown(event: KeyboardEvent) {
		if (props.disabled) return;

		const { step, min, max } = props;
		let next: number | null = null;

		switch (event.key) {
			case 'ArrowUp':
			case 'ArrowRight':
				next = props.value + step;
				break;
			case 'ArrowDown':
			case 'ArrowLeft':
				next = props.value - step;
				break;
			case 'Home':
				next = min;
				break;
			case 'End':
				next = max;
				break;
			case 'PageUp':
				next = props.value + step * 2;
				break;
			case 'PageDown':
				next = props.value - step * 2;
				break;
		}

		if (next !== null) {
			event.preventDefault();

			const clamped = align(next);

			if (clamped !== props.value) emit('change', clamped);
		}
	}

	const handleStyle = computed(() => ({
		left: `${offsetPercent.value}%`,
		right: 'auto',
		transform: 'translateX(-50%)'
	}));
</script>

<template>
	<div
		ref="sliderRef"
		:class="[prefixCls, className, { [`${prefixCls}-disabled`]: disabled }]"
		@mousedown="onSliderMouseDown"
	>
		<div :class="`${prefixCls}-rail`"></div>

		<div
			:class="`${prefixCls}-track`"
			:style="{ left: '0%', width: `${offsetPercent}%`, visibility: 'visible' }"
		></div>

		<div
			:class="[`${prefixCls}-handle`]"
			:style="handleStyle"
			tabindex="0"
			role="slider"
			:aria-valuenow="value"
			:aria-valuemin="min"
			:aria-valuemax="max"
			:aria-disabled="disabled"
			@keydown="onKeyDown"
		></div>
	</div>
</template>
