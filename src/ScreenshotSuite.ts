import { AsyncFunction } from './types';
import Screenshot from './Screenshot';

class ScreenshotSuite {
	name: string;
	screenshots: Record<string, Screenshot> = {};

	private beforeAll: AsyncFunction | null = null;
	private afterAll: AsyncFunction | null = null;
	private beforeEach: AsyncFunction | null = null;
	private afterEach: AsyncFunction | null = null;

	constructor(name: string) {
		this.name = name;
	}

	setBeforeAll(fn: AsyncFunction): void {
		this.beforeAll = fn;
	}
	setAfterAll(fn: AsyncFunction): void {
		this.afterAll = fn;
	}
	setBeforeEach(fn: AsyncFunction): void {
		this.beforeEach = fn;
	}
	setAfterEach(fn: AsyncFunction): void {
		this.afterEach = fn;
	}

	addScreenshot(name: string, prepare: AsyncFunction): void {
		if (this.screenshots[name]) {
			throw new Error('Screenshots must have unique names.');
		}

		this.screenshots[name] = new Screenshot(name, prepare);
	}

	prepare(): Promise<void> {
		if (this.beforeAll) {
			return this.beforeAll();
		}

		return Promise.resolve();
	}

	done(): Promise<void> {
		if (this.afterAll) {
			return this.afterAll();
		}

		return Promise.resolve();
	}

	prepareScreenshot(): Promise<void> {
		if (this.beforeEach) {
			return this.beforeEach();
		}

		return Promise.resolve();
	}

	doneScreenshot(): Promise<void> {
		if (this.afterEach) {
			return this.afterEach();
		}

		return Promise.resolve();
	}
}

export default ScreenshotSuite;
