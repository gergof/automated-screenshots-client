class EventListener {
	id: number;
	event: string;
	callback: () => void;

	constructor(id: number, event: string, callback: () => void) {
		this.id = id;
		this.event = event;
		this.callback = callback;
	}
}

class EventBridge {
	private listeners: EventListener[] = [];

	on(event: string, callback: () => void): void {
		this.listeners.push(new EventListener(Math.random(), event, callback));
	}

	once(event: string, callback: () => void): void {
		const id = Math.random();
		this.listeners.push(
			new EventListener(id, event, () => {
				callback();

				this.listeners = this.listeners.filter(
					listener => listener.id != id
				);
			})
		);
	}

	emit(event: string): void {
		this.listeners
			.filter(listener => listener.event == event)
			.forEach(listener => {
				listener.callback();
			});
	}
}

export default EventBridge;
