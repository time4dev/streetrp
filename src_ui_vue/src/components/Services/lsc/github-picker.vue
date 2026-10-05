<script setup lang="ts">
	import { computed, ref } from 'vue';
	import type { CSSProperties } from 'vue';
	import { hexToRgb, type RGBColor } from './types';

	// Faithful Vue port of react-color@2.19.3 GithubPicker (Github.js + GithubSwatch.js +
	// common/Swatch.js), with the original inline styles kept as :style bindings.
	const props = withDefaults(
		defineProps<{
			color?: RGBColor | string;
			colors?: string[];
			width?: string | number;
			triangle?: 'hide' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
			className?: string;
		}>(),
		{
			colors: () => [
				'#B80000',
				'#DB3E00',
				'#FCCB00',
				'#008B02',
				'#006B76',
				'#1273DE',
				'#004DCF',
				'#5300EB',
				'#EB9694',
				'#FAD0C3',
				'#FEF3BD',
				'#C1E1C5',
				'#BEDADC',
				'#C4DEF6',
				'#BED3F3',
				'#D4C4FB'
			],
			width: 200,
			triangle: 'top-left',
			className: ''
		}
	);

	const emit = defineEmits<{ change: [color: RGBColor] }>();

	const hoveredIndex = ref(-1);

	// Github.js triangle variants
	const triangleVariants: Record<
		string,
		{ triangle: Record<string, string>; triangleShadow: Record<string, string> }
	> = {
		hide: { triangle: { display: 'none' }, triangleShadow: { display: 'none' } },
		'top-left': { triangle: { top: '-14px', left: '10px' }, triangleShadow: { top: '-16px', left: '9px' } },
		'top-right': { triangle: { top: '-14px', right: '10px' }, triangleShadow: { top: '-16px', right: '9px' } },
		'bottom-left': {
			triangle: { top: '35px', left: '10px', transform: 'rotate(180deg)' },
			triangleShadow: { top: '37px', left: '9px', transform: 'rotate(180deg)' }
		},
		'bottom-right': {
			triangle: { top: '35px', right: '10px', transform: 'rotate(180deg)' },
			triangleShadow: { top: '37px', right: '9px', transform: 'rotate(180deg)' }
		}
	};

	const cardStyle = computed<CSSProperties>(() => ({
		width: props.width,
		background: '#fff',
		border: '1px solid rgba(0,0,0,0.2)',
		boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
		borderRadius: '4px',
		position: 'relative',
		padding: '5px',
		display: 'flex',
		flexWrap: 'wrap'
	}));

	const triangleStyle = computed<CSSProperties>(() => ({
		position: 'absolute',
		border: '7px solid transparent',
		borderBottomColor: '#fff',
		...triangleVariants[props.triangle ?? 'top-left'].triangle
	}));

	const triangleShadowStyle = computed<CSSProperties>(() => ({
		position: 'absolute',
		border: '8px solid transparent',
		borderBottomColor: 'rgba(0,0,0,0.15)',
		...triangleVariants[props.triangle ?? 'top-left'].triangleShadow
	}));

	// GithubSwatch: 25px cell, hovered swatch pops out
	function swatchWrapperStyle(index: number): CSSProperties {
		const style: CSSProperties = {
			width: '25px',
			height: '25px',
			fontSize: '0'
		};

		if (hoveredIndex.value === index) {
			Object.assign(style, {
				position: 'relative',
				zIndex: '2',
				outline: '2px solid #fff',
				boxShadow: '0 0 5px 2px rgba(0,0,0,0.25)'
			});
		}

		return style;
	}

	// common/Swatch
	function swatchStyle(color: string): CSSProperties {
		return {
			background: color,
			height: '100%',
			width: '100%',
			cursor: 'pointer',
			position: 'relative',
			outline: 'none'
		};
	}

	function select(color: string) {
		// original: onChange({ hex: color, source: 'hex' }) via ColorWrap
		emit('change', hexToRgb(color) ?? { r: 0, g: 0, b: 0, a: 1 });
	}

	function onSwatchKeyDown(color: string, event: KeyboardEvent) {
		// Swatch.js: ENTER (13) triggers the click
		if (event.keyCode === 13) select(color);
	}
</script>

<template>
	<div :class="['github-picker', className]" :style="cardStyle">
		<div :style="triangleShadowStyle"></div>
		<div :style="triangleStyle"></div>

		<div
			v-for="(swatch, index) in colors"
			:key="swatch"
			:style="swatchWrapperStyle(index)"
			@mouseenter="hoveredIndex = index"
			@mouseleave="hoveredIndex = -1"
		>
			<div
				:style="swatchStyle(swatch)"
				:title="swatch"
				tabindex="0"
				@click="select(swatch)"
				@keydown="onSwatchKeyDown(swatch, $event)"
			></div>
		</div>
	</div>
</template>
