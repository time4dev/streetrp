<script setup lang="ts">
	import { computed, getCurrentInstance, onBeforeUnmount, reactive, ref, watch } from 'vue';
	import type { CSSProperties } from 'vue';
	import { throttle } from 'lodash-es';
	import {
		hexToRgb,
		hslToRgb,
		hsvToRgb,
		isValidHex,
		rgbToHex,
		rgbToHsl,
		rgbToHsv,
		type RGBColor
	} from './types';

	// Faithful Vue port of react-color@2.19.3 ChromePicker (Chrome.js + ChromeFields.js
	// + common/{Saturation,Hue,Alpha,Checkboard,EditableInput}.js + ColorWrap), with the
	// original inline styles kept as :style bindings and the injected <style> gradients
	// moved inline too.
	type Hsl = { h: number; s: number; l: number; a: number };
	type Hsv = { h: number; s: number; v: number; a: number };
	type Rgb = { r: number; g: number; b: number; a: number };

	type ColorState = {
		hsl: Hsl;
		hsv: Hsv;
		rgb: Rgb;
		hex: string;
		oldHue: number;
		source?: string;
	};

	type PickerStyles = {
		default?: { picker?: Record<string, string | number> } & {
			[key: string]: Record<string, string | number> | undefined;
		};
	};

	const props = withDefaults(
		defineProps<{
			color: RGBColor | string;
			disableAlpha?: boolean;
			className?: string;
			styles?: PickerStyles;
		}>(),
		{ disableAlpha: false, className: '', styles: () => ({}) }
	);

	const emit = defineEmits<{ change: [color: RGBColor] }>();

	// --- react-color helpers/color: simpleCheckForValidColor ---------------------

	function simpleCheckForValidColor(data: any) {
		const keysToCheck = ['r', 'g', 'b', 'a', 'h', 's', 'l', 'v'];
		let checked = 0;
		let passed = 0;

		keysToCheck.forEach((letter) => {
			if (data[letter]) {
				checked += 1;

				if (!isNaN(data[letter])) passed += 1;

				if (letter === 's' || letter === 'l') {
					const percentPatt = /^\d+%$/;

					if (percentPatt.test(data[letter])) passed += 1;
				}
			}
		});

		return checked === passed ? data : false;
	}

	// --- ColorWrap: toState ------------------------------------------------------

	function toColorState(data: any, oldHue: number): ColorState {
		let rgb: Rgb;
		const fallback: Rgb = { r: 0, g: 0, b: 0, a: 1 };

		if (typeof data === 'string') {
			rgb = hexToRgb(data) ?? fallback;
		} else if (data.hex) {
			rgb = hexToRgb(data.hex) ?? fallback;
		} else if (data.r !== undefined || data.g !== undefined || data.b !== undefined) {
			rgb = { r: data.r || 0, g: data.g || 0, b: data.b || 0, a: data.a ?? 1 };
		} else if (data.v !== undefined) {
			rgb = { ...hsvToRgb(data.h || 0, data.s || 0, data.v), a: data.a ?? 1 };
		} else if (data.l !== undefined) {
			rgb = { ...hslToRgb(data.h || 0, data.s || 0, data.l), a: data.a ?? 1 };
		} else {
			rgb = fallback;
		}

		const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b, rgb.a);
		const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b, rgb.a);
		const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

		if (hsl.s === 0) {
			hsl.h = oldHue || 0;
			hsv.h = oldHue || 0;
		}

		const transparent = hex === '000000' && rgb.a === 0;

		return {
			hsl,
			hsv,
			rgb,
			hex: transparent ? 'transparent' : `#${hex}`,
			oldHue: data.h || oldHue || hsl.h,
			source: data.source
		};
	}

	const colorState = reactive<ColorState>(toColorState(props.color, 0));

	watch(
		() => props.color,
		(next) => Object.assign(colorState, toColorState(next, colorState.oldHue)),
		{ deep: true }
	);

	// --- ColorWrap: handleChange -------------------------------------------------

	function handleChange(data: any) {
		const isValidColor = simpleCheckForValidColor(data);

		if (isValidColor) {
			const colors = toColorState(data, data.h || colorState.oldHue);

			Object.assign(colorState, colors);

			emit('change', { ...colorState.rgb });
		}
	}

	// --- common/Checkboard -------------------------------------------------------

	const checkboardCache: Record<string, string | null> = {};

	function renderCheckboard(c1: string, c2: string, size: number): string | null {
		const key = `${c1}-${c2}-${size}`;

		if (checkboardCache[key]) return checkboardCache[key];

		const canvas = document.createElement('canvas');

		canvas.width = size * 2;
		canvas.height = size * 2;

		const ctx = canvas.getContext('2d');

		if (!ctx) return null;

		ctx.fillStyle = c1;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = c2;
		ctx.fillRect(0, 0, size, size);
		ctx.translate(size, size);
		ctx.fillRect(0, 0, size, size);

		const url = canvas.toDataURL();

		checkboardCache[key] = url;

		return url;
	}

	const checkboard = renderCheckboard('transparent', 'rgba(0,0,0,.08)', 8);

	// --- common/Saturation -------------------------------------------------------

	const saturationRef = ref<HTMLElement>();

	function saturationCalculateChange(
		event: MouseEvent | TouchEvent,
		hsl: Hsl,
		container: HTMLElement | undefined
	) {
		if (!container) return null;

		const bounds = container.getBoundingClientRect();
		const containerWidth = bounds.width;
		const containerHeight = bounds.height;
		const x = 'touches' in event ? event.touches[0].pageX : event.pageX;
		const y = 'touches' in event ? event.touches[0].pageY : event.pageY;

		let left = x - (bounds.left + window.pageXOffset);
		let top = y - (bounds.top + window.pageYOffset);

		if (left < 0) left = 0;
		else if (left > containerWidth) left = containerWidth;

		if (top < 0) top = 0;
		else if (top > containerHeight) top = containerHeight;

		const saturation = left / containerWidth;
		const bright = 1 - top / containerHeight;

		return { h: hsl.h, s: saturation, v: bright, a: hsl.a, source: 'hsv' };
	}

	const saturationThrottled = throttle(handleChange, 50);

	function onSaturationChange(event: MouseEvent | TouchEvent) {
		const data = saturationCalculateChange(event, colorState.hsl, saturationRef.value);

		if (data) saturationThrottled(data);
	}

	function onSaturationMouseDown(event: MouseEvent) {
		onSaturationChange(event);

		window.addEventListener('mousemove', onSaturationChange);
		window.addEventListener('mouseup', onSaturationMouseUp);
	}

	function onSaturationMouseUp() {
		window.removeEventListener('mousemove', onSaturationChange);
		window.removeEventListener('mouseup', onSaturationMouseUp);
	}

	// --- common/Hue --------------------------------------------------------------

	const hueRef = ref<HTMLElement>();

	function hueCalculateChange(
		event: MouseEvent | TouchEvent,
		hsl: Hsl,
		container: HTMLElement | undefined
	) {
		if (!container) return null;

		// only the horizontal direction is used by the ChromePicker
		const containerWidth = container.clientWidth;
		const x = 'touches' in event ? event.touches[0].pageX : event.pageX;

		const left = x - (container.getBoundingClientRect().left + window.pageXOffset);

		let h: number;

		if (left < 0) h = 0;
		else if (left > containerWidth) h = 359;
		else h = (360 * ((left * 100) / containerWidth)) / 100;

		if (hsl.h !== h) return { h, s: hsl.s, l: hsl.l, a: hsl.a, source: 'hsl' };

		return null;
	}

	function onHueChange(event: MouseEvent | TouchEvent) {
		const change = hueCalculateChange(event, colorState.hsl, hueRef.value);

		if (change) handleChange(change);
	}

	function onHueMouseDown(event: MouseEvent) {
		onHueChange(event);

		window.addEventListener('mousemove', onHueChange);
		window.addEventListener('mouseup', onHueMouseUp);
	}

	function onHueMouseUp() {
		window.removeEventListener('mousemove', onHueChange);
		window.removeEventListener('mouseup', onHueMouseUp);
	}

	// --- common/Alpha (horizontal) -----------------------------------------------

	const alphaRef = ref<HTMLElement>();

	function alphaCalculateChange(
		event: MouseEvent | TouchEvent,
		hsl: Hsl,
		container: HTMLElement | undefined
	) {
		if (!container) return null;

		const containerWidth = container.clientWidth;
		const x = 'touches' in event ? event.touches[0].pageX : event.pageX;

		const left = x - (container.getBoundingClientRect().left + window.pageXOffset);

		let a: number;

		if (left < 0) a = 0;
		else if (left > containerWidth) a = 1;
		else a = Math.round((left * 100) / containerWidth) / 100;

		if (hsl.a !== a) return { h: hsl.h, s: hsl.s, l: hsl.l, a, source: 'rgb' };

		return null;
	}

	function onAlphaChange(event: MouseEvent | TouchEvent) {
		const change = alphaCalculateChange(event, colorState.hsl, alphaRef.value);

		if (change) handleChange(change);
	}

	function onAlphaMouseDown(event: MouseEvent) {
		onAlphaChange(event);

		window.addEventListener('mousemove', onAlphaChange);
		window.addEventListener('mouseup', onAlphaMouseUp);
	}

	function onAlphaMouseUp() {
		window.removeEventListener('mousemove', onAlphaChange);
		window.removeEventListener('mouseup', onAlphaMouseUp);
	}

	// --- ChromeFields ------------------------------------------------------------

	type FieldLabel = 'hex' | 'r' | 'g' | 'b' | 'a' | 'h' | 's' | 'l';

	const viewFields: Record<'hex' | 'rgb' | 'hsl', { label: FieldLabel; alpha?: boolean }[]> = {
		hex: [{ label: 'hex' }],
		rgb: [
			{ label: 'r' },
			{ label: 'g' },
			{ label: 'b' },
			{ label: 'a', alpha: true }
		],
		hsl: [
			{ label: 'h' },
			{ label: 's' },
			{ label: 'l' },
			{ label: 'a', alpha: true }
		]
	};

	const view = ref<'hex' | 'rgb' | 'hsl'>(colorState.hsl.a !== 1 ? 'rgb' : 'hex');

	const fieldConfigs = computed(() => viewFields[view.value]);

	// getDerivedStateFromProps
	watch(
		() => colorState.hsl.a,
		(a) => {
			if (a !== 1 && view.value === 'hex') view.value = 'rgb';
		}
	);

	function toggleViews() {
		if (view.value === 'hex') view.value = 'rgb';
		else if (view.value === 'rgb') view.value = 'hsl';
		else if (view.value === 'hsl') view.value = colorState.hsl.a === 1 ? 'hex' : 'rgb';
	}

	function highlightIcon(event: MouseEvent, show: boolean) {
		(event.currentTarget as HTMLElement).style.background = show ? '#eee' : 'transparent';
	}

	// common/EditableInput state, one entry per rendered field
	const inputValues = reactive<Partial<Record<FieldLabel, string>>>({});
	const blurValues = reactive<Partial<Record<FieldLabel, string | null>>>({});
	const focusedInputs = reactive<Partial<Record<FieldLabel, boolean>>>({});
	const inputId = `rc-editable-input-${getCurrentInstance()?.uid ?? 0}`;

	function propValueFor(label: FieldLabel): string {
		switch (label) {
			case 'hex':
				return colorState.hex;
			case 'r':
				return String(colorState.rgb.r);
			case 'g':
				return String(colorState.rgb.g);
			case 'b':
				return String(colorState.rgb.b);
			case 'a':
				return String(colorState.rgb.a);
			case 'h':
				return String(Math.round(colorState.hsl.h));
			case 's':
				return `${Math.round(colorState.hsl.s * 100)}%`;
			case 'l':
				return `${Math.round(colorState.hsl.l * 100)}%`;
		}
	}

	function initInputs() {
		for (const { label } of viewFields[view.value]) {
			const value = String(propValueFor(label)).toUpperCase();

			inputValues[label] = value;
			blurValues[label] = value;
		}
	}

	watch(view, initInputs, { immediate: true });

	// EditableInput componentDidUpdate: keep the typed value while focused,
	// sync the prop value otherwise
	watch(colorState, () => {
		for (const { label } of viewFields[view.value]) {
			const next = String(propValueFor(label)).toUpperCase();

			if (inputValues[label] !== next) {
				if (focusedInputs[label]) {
					blurValues[label] = next;
				} else {
					inputValues[label] = next;

					if (!blurValues[label]) blurValues[label] = next;
				}
			}
		}
	});

	function getNumberValue(value: string) {
		return Number(String(value).replace(/%/g, ''));
	}

	// ChromeFields.handleChange
	function fieldsHandleChange(data: any) {
		if (data.hex) {
			if (isValidHex(data.hex)) handleChange({ hex: data.hex, source: 'hex' });
		} else if (data.r || data.g || data.b) {
			handleChange({
				r: data.r || colorState.rgb.r,
				g: data.g || colorState.rgb.g,
				b: data.b || colorState.rgb.b,
				source: 'rgb'
			});
		} else if (data.a) {
			const a = data.a;
			const clamped = a < 0 ? 0 : a > 1 ? 1 : Math.round(a * 100) / 100;

			handleChange({
				h: colorState.hsl.h,
				s: colorState.hsl.s,
				l: colorState.hsl.l,
				a: clamped,
				source: 'rgb'
			});
		} else if (data.h || data.s || data.l) {
			if (typeof data.s === 'string' && data.s.includes('%')) data.s = data.s.replace('%', '');
			if (typeof data.l === 'string' && data.l.includes('%')) data.l = data.l.replace('%', '');

			if (data.s == 1) data.s = 0.01;
			else if (data.l == 1) data.l = 0.01;

			handleChange({
				h: data.h || colorState.hsl.h,
				s: Number(data.s === undefined ? colorState.hsl.s : data.s),
				l: Number(data.l === undefined ? colorState.hsl.l : data.l),
				source: 'hsl'
			});
		}
	}

	function setUpdatedValue(label: FieldLabel, value: string | number) {
		fieldsHandleChange({ [label]: value });

		inputValues[label] = String(value);
	}

	function onInputChange(label: FieldLabel, event: Event) {
		setUpdatedValue(label, (event.target as HTMLInputElement).value);
	}

	// EditableInput.handleKeyDown (arrow keys, arrowOffset 0.01 for the alpha field)
	function onInputKeyDown(label: FieldLabel, event: KeyboardEvent) {
		const value = getNumberValue((event.target as HTMLInputElement).value);

		if (!isNaN(value) && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
			const offset = label === 'a' ? 0.01 : 1;
			const updatedValue = event.key === 'ArrowUp' ? value + offset : value - offset;

			setUpdatedValue(label, updatedValue);
		}
	}

	function onInputBlur(label: FieldLabel) {
		focusedInputs[label] = false;

		if (blurValues[label]) {
			inputValues[label] = blurValues[label]!;
			blurValues[label] = null;
		}
	}

	// --- styles (reactcss originals) ---------------------------------------------

	const pickerStyle = computed<CSSProperties>(() => ({
		width: 225,
		background: '#fff',
		borderRadius: '2px',
		boxShadow: '0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3)',
		boxSizing: 'initial',
		fontFamily: 'Menlo',
		...(props.styles?.default?.picker ?? {})
	}));

	const inputStyle: CSSProperties = {
		fontSize: '11px',
		color: '#333',
		width: '100%',
		borderRadius: '2px',
		border: 'none',
		boxShadow: 'inset 0 0 0 1px #dadada',
		height: '21px',
		textAlign: 'center'
	};

	const labelStyle: CSSProperties = {
		textTransform: 'uppercase',
		fontSize: '11px',
		lineHeight: '11px',
		color: '#969696',
		textAlign: 'center',
		display: 'block',
		marginTop: '12px'
	};

	// --- ChromePointer / ChromePointerCircle -------------------------------------

	const pointerStyle: CSSProperties = {
		width: '12px',
		height: '12px',
		borderRadius: '6px',
		transform: 'translate(-6px, -1px)',
		backgroundColor: 'rgb(248, 248, 248)',
		boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)'
	};

	const pointerCircleStyle: CSSProperties = {
		width: '12px',
		height: '12px',
		borderRadius: '6px',
		boxShadow: 'inset 0 0 0 1px #fff',
		transform: 'translate(-6px, -6px)'
	};

	onBeforeUnmount(() => {
		saturationThrottled.cancel();

		window.removeEventListener('mousemove', onSaturationChange);
		window.removeEventListener('mouseup', onSaturationMouseUp);
		window.removeEventListener('mousemove', onHueChange);
		window.removeEventListener('mouseup', onHueMouseUp);
		window.removeEventListener('mousemove', onAlphaChange);
		window.removeEventListener('mouseup', onAlphaMouseUp);
	});
</script>

<template>
	<div :class="['chrome-picker', className]" :style="pickerStyle">
		<!-- Saturation -->
		<div
			:style="{
				width: '100%',
				paddingBottom: '55%',
				position: 'relative',
				borderRadius: '2px 2px 0 0',
				overflow: 'hidden'
			}"
		>
			<div
				ref="saturationRef"
				:style="{
					position: 'absolute',
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
					background: `hsl(${colorState.hsl.h},100%, 50%)`,
					borderRadius: '2px 2px 0 0'
				}"
				@mousedown="onSaturationMouseDown"
				@touchmove="onSaturationChange"
				@touchstart="onSaturationChange"
			>
				<div
					class="saturation-white"
					:style="{
						position: 'absolute',
						top: 0,
						right: 0,
						bottom: 0,
						left: 0,
						background: 'linear-gradient(to right, #fff, rgba(255,255,255,0))'
					}"
				>
					<div
						class="saturation-black"
						:style="{
							position: 'absolute',
							top: 0,
							right: 0,
							bottom: 0,
							left: 0,
							background: 'linear-gradient(to top, #000, rgba(0,0,0,0))'
						}"
					></div>

					<div
						:style="{
							position: 'absolute',
							top: `${100 - colorState.hsv.v * 100}%`,
							left: `${colorState.hsv.s * 100}%`,
							cursor: 'default'
						}"
					>
						<div :style="pointerCircleStyle"></div>
					</div>
				</div>
			</div>
		</div>

		<!-- Body -->
		<div :style="{ padding: '16px 16px 12px' }">
			<div :style="{ display: 'flex' }" class="flexbox-fix">
				<div :style="{ width: disableAlpha ? '22px' : '32px' }">
					<div
						:style="{
							marginTop: disableAlpha ? '0px' : '6px',
							width: disableAlpha ? '10px' : '16px',
							height: disableAlpha ? '10px' : '16px',
							borderRadius: '8px',
							position: 'relative',
							overflow: 'hidden'
						}"
					>
						<div
							:style="{
								position: 'absolute',
								top: 0,
								right: 0,
								bottom: 0,
								left: 0,
								borderRadius: '8px',
								boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1)',
								background: `rgba(${colorState.rgb.r}, ${colorState.rgb.g}, ${colorState.rgb.b}, ${colorState.rgb.a})`,
								zIndex: 2
							}"
						></div>

						<div
							:style="{
								position: 'absolute',
								top: 0,
								right: 0,
								bottom: 0,
								left: 0,
								background: `url(${checkboard}) center left`
							}"
						></div>
					</div>
				</div>

				<div :style="{ flex: '1' }">
					<!-- Hue -->
					<div :style="{ height: '10px', position: 'relative', marginBottom: disableAlpha ? '0px' : '8px' }">
						<div :style="{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: '2px' }">
							<div
								ref="hueRef"
								class="hue-horizontal"
								:style="{
									padding: '0 2px',
									position: 'relative',
									height: '100%',
									borderRadius: '2px',
									background:
										'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
								}"
								@mousedown="onHueMouseDown"
								@touchmove="onHueChange"
								@touchstart="onHueChange"
							>
								<div :style="{ position: 'absolute', left: `${(colorState.hsl.h * 100) / 360}%` }">
									<div :style="pointerStyle"></div>
								</div>
							</div>
						</div>
					</div>

					<!-- Alpha -->
					<div
						:style="{
							height: '10px',
							position: 'relative',
							display: disableAlpha ? 'none' : undefined
						}"
					>
						<div :style="{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: '2px' }">
							<div
								:style="{
									position: 'absolute',
									top: 0,
									right: 0,
									bottom: 0,
									left: 0,
									overflow: 'hidden',
									borderRadius: '2px'
								}"
							>
								<div
									:style="{
										position: 'absolute',
										top: 0,
										right: 0,
										bottom: 0,
										left: 0,
										background: `url(${checkboard}) center left`
									}"
								></div>
							</div>

							<div
								:style="{
									position: 'absolute',
									top: 0,
									right: 0,
									bottom: 0,
									left: 0,
									background: `linear-gradient(to right, rgba(${colorState.rgb.r},${colorState.rgb.g},${colorState.rgb.b}, 0) 0%, rgba(${colorState.rgb.r},${colorState.rgb.g},${colorState.rgb.b}, 1) 100%)`
								}"
							></div>

							<div
								ref="alphaRef"
								:style="{ position: 'relative', height: '100%', margin: '0 3px' }"
								@mousedown="onAlphaMouseDown"
								@touchmove="onAlphaChange"
								@touchstart="onAlphaChange"
							>
								<div :style="{ position: 'absolute', left: `${colorState.rgb.a * 100}%` }">
									<div :style="pointerStyle"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- ChromeFields -->
			<div :style="{ paddingTop: '16px', display: 'flex' }" class="flexbox-fix">
				<div :style="{ flex: '1', display: 'flex', marginLeft: '-6px' }" class="flexbox-fix">
					<div
						v-for="field in fieldConfigs"
						:key="field.label"
						:style="{
							paddingLeft: '6px',
							width: '100%',
							display: field.alpha && disableAlpha ? 'none' : undefined
						}"
					>
						<div :style="{ position: 'relative' }">
							<input
								:id="`${inputId}-${field.label}`"
								:style="inputStyle"
								:value="inputValues[field.label]"
								spellcheck="false"
								@input="onInputChange(field.label, $event)"
								@keydown="onInputKeyDown(field.label, $event)"
								@focus="focusedInputs[field.label] = true"
								@blur="onInputBlur(field.label)"
							/>

							<label :for="`${inputId}-${field.label}`" :style="labelStyle">{{ field.label }}</label>
						</div>
					</div>
				</div>

				<div :style="{ width: '32px', textAlign: 'right', position: 'relative' }">
					<div
						:style="{ marginRight: '-4px', marginTop: '12px', cursor: 'pointer', position: 'relative' }"
						@click="toggleViews"
					>
						<svg
							:style="{
								fill: '#333',
								width: '24px',
								height: '24px',
								border: '1px transparent solid',
								borderRadius: '5px'
							}"
							viewBox="0 0 24 24"
							@mouseover="highlightIcon($event, true)"
							@mouseenter="highlightIcon($event, true)"
							@mouseout="highlightIcon($event, false)"
						>
							<path
								d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15l-3.17 3.17z"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
