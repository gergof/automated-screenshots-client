import AutomatedScreenshotClient from '../index';

const client = new AutomatedScreenshotClient({
	wsAddress: 'ws://localhost:8700'
});

client.suite('Suite 1', ({ beforeAll, afterEach, screenshot }) => {
	beforeAll(async () => {
		console.log('!!! Starting to capture suite 1');
	});

	afterEach(async () => {
		console.log('!!! Screenshot finished');
	});

	screenshot('first screenshot', async () => {
		// 50% on the X coordinate and 95% on the Y coordinate (from the top-left corner)
		await client.click(50, 95);
		console.log('prepare 1');
	});

	screenshot('second screenshot', async () => {
		await client.type('This is an example text');
		console.log('prepare 2');
	});

	screenshot('third screenshot', async () => {
		console.log('prepare 3');
	});
});

client.suite('Suite 2', ({ screenshot, afterAll }) => {
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

client.start().then(() => {
	console.log('!!! Started taking screenshots');
});
