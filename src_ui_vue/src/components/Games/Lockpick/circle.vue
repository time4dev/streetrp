<script setup lang="ts">
	import { computed } from 'vue';
	import type { ComponentPublicInstance, CSSProperties, Ref } from 'vue';
	import { random } from 'lodash-es';
	import RcCircle from '@/components/Common/rc-circle.vue';

	type RefElement = Element | ComponentPublicInstance | null;

	const props = defineProps<{
		// Legacy: React.RefObject props — the parent reads the rotated DOM elements
		point: Ref<HTMLDivElement | null>;
		pointer: Ref<HTMLDivElement | null>;

		rotations: {
			point: number;
			pointer: number;
		};
	}>();

	const emit = defineEmits<{ click: [] }>();

	function setPointRef(el: RefElement) {
		props.point.value = el as HTMLDivElement | null;
	}

	function setPointerRef(el: RefElement) {
		props.pointer.value = el as HTMLDivElement | null;
	}

	const pointerStyle = computed<CSSProperties>(() => {
		// Legacy re-randomized the duration on every parent re-render (each successful pick
		// rotates the point) — read `point` here so it re-runs on every pick as well
		props.rotations.point;

		return {
			transform: `rotate(${props.rotations.pointer}deg)`,
			animationDuration: `${random(1.5, 2)}s`
		};
	});
</script>

<template>
	<div class="lockpick_circle" @click="emit('click')">
		<RcCircle
			class-name="lockpick_circle-progress"
			:stroke-width="3"
			:trail-width="3"
			trail-color="#fff"
			stroke-color="#ff0082"
			stroke-linecap="square"
		/>

		<div
			:ref="setPointRef"
			class="lockpick_circle-point"
			:style="{ transform: `rotate(${rotations.point}deg)` }"
		/>
		<div :ref="setPointerRef" class="lockpick_circle-pointer" :style="pointerStyle" />
	</div>
</template>
