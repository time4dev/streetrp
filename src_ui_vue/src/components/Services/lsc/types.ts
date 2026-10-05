// Port of the `react-color` type + tinycolor2 color math used by the local
// ChromePicker/GithubPicker ports (no new npm packages allowed).

export type RGBColor = {
	r: number;
	g: number;
	b: number;
	a?: number;
};

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

// tinycolor2 `toHex`
export function rgbToHex(r: number, g: number, b: number): string {
	const hex = (value: number) =>
		clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0');

	return hex(r) + hex(g) + hex(b);
}

// react-color helpers/color `isValidHex`
export function isValidHex(hex: string): boolean {
	if (hex === 'transparent') return true;

	const value = String(hex);
	const lh = value.charAt(0) === '#' ? 1 : 0;

	return (
		value.length !== 4 + lh &&
		value.length < 7 + lh &&
		/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)
	);
}

// tinycolor2 `toRgb` from a hex string
export function hexToRgb(hex: string): { r: number; g: number; b: number; a: number } | null {
	if (hex === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };

	if (!isValidHex(hex)) return null;

	const clean = hex.replace('#', '');
	const full =
		clean.length === 3
			? clean
					.split('')
					.map((char) => char + char)
					.join('')
			: clean;

	return {
		r: parseInt(full.slice(0, 2), 16),
		g: parseInt(full.slice(2, 4), 16),
		b: parseInt(full.slice(4, 6), 16),
		a: 1
	};
}

// tinycolor2 `toHsl`
export function rgbToHsl(r: number, g: number, b: number, a = 1) {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);

	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (max !== min) {
		const d = max - min;

		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}

		h /= 6;
	}

	return { h: h * 360, s, l, a };
}

// tinycolor2 `toHsv`
export function rgbToHsv(r: number, g: number, b: number, a = 1) {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);

	let h = 0;
	const d = max - min;
	const s = max === 0 ? 0 : d / max;
	const v = max;

	if (max !== min) {
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}

		h /= 6;
	}

	return { h: h * 360, s, v, a };
}

// tinycolor2 `hslToRgb`
export function hslToRgb(h: number, s: number, l: number) {
	h = (((h % 360) + 360) % 360) / 360;

	function hue2rgb(p: number, q: number, t: number) {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

		return p;
	}

	let r: number;
	let g: number;
	let b: number;

	if (s === 0) {
		r = g = b = l;
	} else {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

// tinycolor2 `hsvToRgb`
export function hsvToRgb(h: number, s: number, v: number) {
	h = ((((h % 360) + 360) % 360) / 60) % 6;

	const i = Math.floor(h);
	const f = h - i;
	const p = v * (1 - s);
	const q = v * (1 - s * f);
	const t = v * (1 - s * (1 - f));

	let r: number;
	let g: number;
	let b: number;

	switch (i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		default:
			r = v;
			g = p;
			b = q;
	}

	return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}
