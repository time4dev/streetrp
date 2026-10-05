<script setup lang="ts">
	import { computed, type CSSProperties } from 'vue';

	// Faithful port of rc-progress@3 <Circle> (es/Circle + es/Circle/util).
	const props = withDefaults(
		defineProps<{
			percent?: number;
			prefixCls?: string;
			strokeWidth?: number;
			trailWidth?: number;
			strokeColor?: string;
			trailColor?: string;
			strokeLinecap?: 'round' | 'butt' | 'square';
			gapDegree?: number;
			gapPosition?: 'top' | 'bottom' | 'left' | 'right';
			className?: string;
		}>(),
		{
			percent: 0,
			prefixCls: 'rc-progress',
			strokeWidth: 1,
			trailWidth: 1,
			strokeColor: '#2db7f5',
			trailColor: '#D9D9D9',
			strokeLinecap: 'round',
			gapDegree: 0,
			gapPosition: undefined
		}
	);

	const VIEW_BOX_SIZE = 100;

	const halfSize = VIEW_BOX_SIZE / 2;
	const radius = computed(() => halfSize - props.strokeWidth / 2);
	const perimeter = computed(() => Math.PI * 2 * radius.value);
	const rotateDeg = computed(() => (props.gapDegree > 0 ? 90 + props.gapDegree / 2 : -90));
	const perimeterWithoutGap = computed(() => perimeter.value * ((360 - props.gapDegree) / 360));

	function positionDeg() {
		if (props.gapDegree === 0) return 0;

		return { bottom: 0, top: 180, left: 90, right: -90 }[props.gapPosition ?? 'top'];
	}

	function getCircleStyle(percent: number, offset: number, strokeColor: string): CSSProperties {
		let strokeDashoffset = ((100 - percent) / 100) * perimeterWithoutGap.value;

		// Fix percent accuracy when strokeLinecap is round
		if (props.strokeLinecap === 'round' && percent !== 100) {
			strokeDashoffset += props.strokeWidth / 2;

			if (strokeDashoffset >= perimeterWithoutGap.value) {
				strokeDashoffset = perimeterWithoutGap.value - 0.01;
			}
		}

		return {
			stroke: strokeColor,
			strokeDasharray: `${perimeterWithoutGap.value}px ${perimeter.value}px`,
			strokeDashoffset,
			transform: `rotate(${rotateDeg.value + (offset / 100) * 360 * ((360 - props.gapDegree) / 360) + positionDeg()}deg)`,
			transformOrigin: `${halfSize}px ${halfSize}px`,
			transition:
				'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s, opacity .3s ease 0s',
			fillOpacity: 0
		} as CSSProperties;
	}

	const trailStyle = computed(() =>
		getCircleStyle(100, 0, props.trailColor)
	);
	const pathStyle = computed(() => getCircleStyle(props.percent, 0, props.strokeColor));
</script>

<template>
	<svg
		:class="[`${prefixCls}-circle`, className]"
		:viewBox="`0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`"
		role="presentation"
	>
		<circle
			:class="`${prefixCls}-circle-trail`"
			:r="radius"
			:cx="halfSize"
			:cy="halfSize"
			:stroke="trailColor"
			:stroke-linecap="strokeLinecap"
			:stroke-width="trailWidth || strokeWidth"
			:style="trailStyle"
		/>

		<circle
			:class="`${prefixCls}-circle-path`"
			:r="radius"
			:cx="halfSize"
			:cy="halfSize"
			:stroke="strokeColor"
			:stroke-linecap="strokeLinecap"
			:stroke-width="strokeWidth"
			:opacity="percent === 0 ? 0 : 1"
			:style="pathStyle"
		/>
	</svg>
</template>
