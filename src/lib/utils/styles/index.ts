export function isFunction(fn: unknown): fn is () => unknown {
	return typeof fn === "function";
}

export function runIfFn<T, U>(valueOrFn: T | ((...fnArgs: U[]) => T), ...args: U[]): T {
	return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn;
}

export interface SlotProp<T extends string> {
	slotClasses?: Partial<Record<T, string>>;
}
