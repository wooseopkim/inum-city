export default function silent<T, R>(block: (x?: T) => R): typeof block {
	return (x?: T) => {
		const methods = ['log', 'info', 'debug', 'warn', 'error', 'trace'] as const;
		for (const method of methods) {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			jest.spyOn(console, method).mockImplementation(() => {});
		}
		const result = block(x);
		for (const method of methods) {
			(console[method] as jest.Mock).mockClear();
		}
		return result;
	};
}
