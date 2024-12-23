export const toHex = (n: number): string => n.toString(16).padStart(2, "0");

export function getHSLAComponents(color: string) {
	const _color = color.toLowerCase().replace(/\s/g, "");
	const hex = color.startsWith("#") ? _color.slice(1) : _color;

	let r = 0;
	let g = 0;
	let b = 0;
	let a = 0;

	if (hex.length === 8) {
		r = Number.parseInt(hex.slice(0, 2), 16) / 255;
		g = Number.parseInt(hex.slice(2, 4), 16) / 255;
		b = Number.parseInt(hex.slice(4, 6), 16) / 255;
		a = Number.parseInt(hex.slice(6, 8), 16);
	} else if (hex.length === 6) {
		r = Number.parseInt(hex.slice(0, 2), 16) / 255;
		g = Number.parseInt(hex.slice(2, 4), 16) / 255;
		b = Number.parseInt(hex.slice(4, 6), 16) / 255;
	}

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
	return {
		h: Math.round(h * 360),
		s: Math.round(s),
		l: Math.round(l),
		a,
	};
}
