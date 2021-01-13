export type AsyncFunction = () => Promise<void>;

export type SuiteDefiniers = {
	beforeAll: (fn: AsyncFunction) => void;
	afterAll: (fn: AsyncFunction) => void;
	beforeEach: (fn: AsyncFunction) => void;
	afterEach: (fn: AsyncFunction) => void;
	screenshot: (name: string, prepare: AsyncFunction) => void;
};

export type SuiteGeneratorFunction = (definiers: SuiteDefiniers) => void;

export type SerializedScreenshot = {
	name: string;
};

export type SerializedScreenshotSuite = {
	name: string;
	screenshots: SerializedScreenshot[];
};

export type SerializedScreenshotPack = {
	suites: SerializedScreenshotSuite[];
};

export enum MessageType {
	PrepareSuite = 'prepare-suite',
	PrepareScreenshot = 'prepare-screenshot',
	Ready = 'ready',
	ScreenshotDone = 'done-screenshot',
	SuiteDone = 'done-suite'
}

export type Message = {
	type: MessageType;
	payload?: string;
};
