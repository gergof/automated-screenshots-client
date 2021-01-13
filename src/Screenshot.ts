import { AsyncFunction } from './types';

class Screenshot {
	name: string;
	prepare: AsyncFunction;

	constructor(name: string, prepare: AsyncFunction) {
		this.name = name;
		this.prepare = prepare;
	}
}

export default Screenshot;
