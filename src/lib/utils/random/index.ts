/**
 * Generate seed values from given string
 */
function cyrb128(str: string) {
	let h1 = 1779033703;
	let h2 = 3144134277;
	let h3 = 1013904242;
	let h4 = 2773480762;
	for (let i = 0, k: number; i < str.length; i++) {
		k = str.charCodeAt(i);
		h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
		h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
		h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
		h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
	}
	h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
	h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
	h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
	h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
	return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
}
/**
 * Generate random number between 0 and 1 with the given string as a seed value
 */
function sfc32(seed: string) {
	let [a, b, c, d] = cyrb128(seed);
	a >>>= 0;
	b >>>= 0;
	c >>>= 0;
	d >>>= 0;
	let t = (a + b) | 0;
	a = b ^ (b >>> 9);
	b = (c + (c << 3)) | 0;
	c = (c << 21) | (c >>> 11);
	d = (d + 1) | 0;
	t = (t + d) | 0;
	c = (c + t) | 0;
	return (t >>> 0) / 4294967296;
}
/**
 * generates pseudo random integers in set range, bounds are inclusive
 * @returns pseudo random integer
 */
export default function getRandomInt(min: number, max: number, seed: string) {
	const _min = Math.ceil(min);
	const _max = Math.floor(max);
	return Math.floor(sfc32(seed) * (_max - _min + 1)) + _min;
}
