import retry from './retry';

describe(retry, () => {
	beforeEach(() => {
		jest.useFakeTimers();
		jest.spyOn(global, 'setTimeout');
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	it('does not retry on success', async () => {
		const target = () => Promise.resolve();
		const generate = function* () {
			yield 100;
			return 10;
		};

		const p = retry(target, generate);

		await expect(p).resolves.toBeUndefined();
		expect(setTimeout).not.toHaveBeenCalled();
	});

	it('does not retry on immediate abort', async () => {
		const target = () => Promise.reject();
		// eslint-disable-next-line require-yield
		const generate = function* () {
			return 10;
		};

		const p = retry(target, generate);

		await expect(p).rejects.toBeUndefined();
		expect(setTimeout).not.toHaveBeenCalled();
	});

	it('triggers again on failures', async () => {
		const target = () => Promise.reject();
		const generate = function* () {
			yield 1000;
			yield 2000;
			yield 3000;
			return 10;
		};

		const p = retry(target, generate);
		jest.advanceTimersByTimeAsync(100_000);

		await expect(p).rejects.toBeUndefined();
		expect(setTimeout).toHaveBeenCalledTimes(3);
		expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 1000);
		expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 2000);
		expect(setTimeout).toHaveBeenNthCalledWith(3, expect.any(Function), 3000);
	});

	it('resolves when retry is successful', async () => {
		let retries = 0;
		const target = function partial() {
			retries++;
			if (retries <= 3) {
				return Promise.reject();
			}
			return Promise.resolve();
		};
		const generate = function* () {
			yield 1000;
			yield 2000;
			yield 3000;
			yield 4000;
			yield 5000;
			return 10;
		};

		const p = retry(target, generate);
		jest.advanceTimersByTimeAsync(100_000);

		await expect(p).resolves.toBeUndefined();
		expect(setTimeout).toHaveBeenCalledTimes(3);
		expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 1000);
		expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 2000);
		expect(setTimeout).toHaveBeenNthCalledWith(3, expect.any(Function), 3000);
	});
});
