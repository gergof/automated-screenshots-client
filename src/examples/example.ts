import AutomatedScreenshotClient from '../index';

const screenshot = new AutomatedScreenshotClient({
	wsAddress: 'ws://localhost:8700'
});

screenshot.suite('Suite 1', ({ beforeAll, afterEach, screenshot }) => {
	beforeAll(async () => {
		console.log('!!! Starting to capture suite 1');
	});

	afterEach(async () => {
		console.log('!!! Screenshot finished');
	});

	screenshot('first screenshot', async () => {
		console.log('prepare 1');
	});

	screenshot('second screenshot', async () => {
		console.log('prepare 2');
	});

	screenshot('third screenshot', async () => {
		console.log('prepare 3');
	});
});

screenshot.suite('Suite 2', ({ screenshot, afterAll }) => {
	afterAll(async () => {
		console.log('!!!!! ALL DONE !!!!!');
	});

	screenshot('1', async () => {
		console.log('prepare 1');
	});

	screenshot('2', async () => {
		console.log('prepare 2');
	});

	screenshot('3', async () => {
		console.log('prepare 3');
	});
});

screenshot.start().then(() => {
	console.log('!!! Started taking screenshots');
});
