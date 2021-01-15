import { w3cwebsocket as W3CWebSocket } from 'websocket';

import ScreenshotSuite from './ScreenshotSuite';
import {
	SuiteGeneratorFunction,
	SuiteDefiniers,
	SerializedScreenshotPack,
	Message,
	MessageType
} from './types';
import EventBridge from './EventBridge';

interface AutomatedScreenshotsClientConstructorProps {
	wsAddress: string;
}

class AutomatedScreenshotsClient {
	private wsAddress: string;
	private suites: Record<string, ScreenshotSuite> = {};

	private ws: WebSocket | W3CWebSocket | null = null;
	private isInitialized = false;

	private eventBridge: EventBridge;

	constructor({ wsAddress }: AutomatedScreenshotsClientConstructorProps) {
		this.wsAddress = wsAddress;
		this.eventBridge = new EventBridge();
	}

	start(): Promise<void> {
		return this.connectWs().then(() => this.initializeWs());
	}

	suite(name: string, generator: SuiteGeneratorFunction): void {
		if (this.suites[name]) {
			throw new Error('Suite names must be unique');
		}

		const suite = new ScreenshotSuite(name);

		const definiers: SuiteDefiniers = {
			beforeAll: suite.setBeforeAll.bind(suite),
			afterAll: suite.setAfterAll.bind(suite),
			beforeEach: suite.setBeforeEach.bind(suite),
			afterEach: suite.setAfterEach.bind(suite),
			screenshot: suite.addScreenshot.bind(suite)
		};
		generator(definiers);

		this.suites[name] = suite;
	}

	click(xPercentage: number, yPercentage: number): Promise<void> {
		return this.executeWsCommand({
			type: MessageType.InputTouch,
			payload: `${xPercentage}x${yPercentage}`
		});
	}

	type(text: string): Promise<void> {
		return this.executeWsCommand({
			type: MessageType.InputText,
			payload: text
		});
	}

	private serialize(): SerializedScreenshotPack {
		return {
			suites: Object.keys(this.suites).map(suiteName => {
				const suite = this.suites[suiteName];

				return {
					name: suiteName,
					screenshots: Object.keys(suite.screenshots).map(
						screenshotName => {
							return {
								name: screenshotName
							};
						}
					)
				};
			})
		};
	}

	private getWebSocket() {
		if (typeof WebSocket != 'undefined') {
			return new WebSocket(this.wsAddress);
		} else if (typeof W3CWebSocket != 'undefined') {
			return new W3CWebSocket(this.wsAddress);
		} else {
			throw new Error(
				'No supported websocket clients available. Please run inside a browser or install peer dependency websocket'
			);
		}
	}

	private connectWs(): Promise<void> {
		const connectLoop = (resolve: () => void) => {
			try {
				this.ws = this.getWebSocket();
				this.ws.onopen = () => {
					console.log('Websocket connected');
					resolve();
				};
				this.ws.onclose = (e: CloseEvent) => {
					if (!this.isInitialized) {
						console.log('Websocket closed:', e.reason);
						console.log('Retrying in 5 seconds...');
						setTimeout(() => connectLoop(resolve), 5000);
					}
				};
			} catch (e) {
				console.log('Failed to connect:', e);
				console.log('Retrying in 5 seconds...');
				setTimeout(() => connectLoop(resolve), 5000);
			}
		};

		return new Promise(resolve => {
			connectLoop(resolve);
		});
	}

	private initializeWs(): Promise<void> {
		if (this.ws) {
			this.isInitialized = true;

			this.ws.onmessage = (message: MessageEvent) => {
				const command: Message = JSON.parse(message.data);
				this.handleWsCommands(command);
			};

			this.ws.send(JSON.stringify(this.serialize()));
		}

		return Promise.resolve();
	}

	private wsAck(): void {
		if (this.ws) {
			this.ws.send(JSON.stringify({ type: MessageType.Ready }));
		}
	}

	private handleWsCommands(command: Message): void {
		switch (command.type) {
			case MessageType.PrepareSuite: {
				const suite = command.payload || '';

				if (this.suites[suite]) {
					this.suites[suite].prepare().then(() => this.wsAck());
				} else {
					this.wsAck();
				}

				return;
			}
			case MessageType.PrepareScreenshot: {
				const suite = command.payload?.split('/')[0] || '';
				const screenshot = command.payload?.split('/')[1] || '';

				if (
					this.suites[suite] &&
					this.suites[suite].screenshots[screenshot]
				) {
					this.suites[suite]
						.prepareScreenshot()
						.then(() =>
							this.suites[suite].screenshots[screenshot].prepare()
						)
						.then(() => this.wsAck());
				} else {
					this.wsAck();
				}

				return;
			}
			case MessageType.ScreenshotDone: {
				const suite = command.payload?.split('/')[0] || '';

				if (this.suites[suite]) {
					this.suites[suite]
						.doneScreenshot()
						.then(() => this.wsAck());
				} else {
					this.wsAck();
				}

				return;
			}
			case MessageType.SuiteDone: {
				const suite = command.payload || '';

				if (this.suites[suite]) {
					this.suites[suite].done().then(() => this.wsAck());
				} else {
					this.wsAck();
				}

				return;
			}
			case MessageType.Ready: {
				this.eventBridge.emit('ready');

				return;
			}
			default:
				this.wsAck();
				return;
		}
	}

	private executeWsCommand(command: Message): Promise<void> {
		return new Promise(resolve => {
			this.ws?.send(JSON.stringify(command));
			this.eventBridge.once('ready', resolve);
		});
	}
}

export default AutomatedScreenshotsClient;
