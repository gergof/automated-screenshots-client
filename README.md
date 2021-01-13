# automated-screenshots-client

[![Build Status](https://ci.systest.eu/api/badges/gergof/automated-screenshots-client/status.svg?ref=refs/heads/master)](https://ci.systest.eu/gergof/automated-screenshots-client)
[![NPM Version](https://img.shields.io/npm/v/automated-screenshots-client)](https://www.npmjs.com/package/automated-screenshots-client)
[![License](https://img.shields.io/npm/l/automated-screenshots-client)](https://www.gnu.org/licenses/gpl-3.0.html)
[![Typescript](https://img.shields.io/npm/types/automated-screenshots-client)](https://www.typescriptlang.org/)
[![Chat](https://img.shields.io/matrix/automated-screenshots:systemtest.tk)](https://matrix.to/#/#automated-screenshots:systemtest.tk)

The client you install in your applications to take automated screenshots with [automated-screenshots](https://github.com/gergof/automated-screenshots).

### automated-screenshots

For more info please check out [this repo](https://github.com/gergof/automated-screenshots).

### Usage

You can check out [this dummy example](https://github.com/gergof/automated-screenshots-client/blob/master/src/examples/example.ts).

```js
// import the client
import AutomatedScreenshotsClient from 'automated-screenshots-client';

// create an instance
const screenshots = new AutomatedScreenshotsClient({
	wsAddress: 'ws://localhost:8700' // the address of the host software
});

// define a suite
screenshots.suite(
	'suite name',
	({ beforeAll, afterAll, beforeEach, afterEach, screenshot }) => {
		beforeAll(async () => {
			await MyApp.login();
		});

		afterEach(async () => {
			await MyApp.navigateToHome();
		});

		// define screenshots
		screenshot('Users menu', async () => {
			await MyApp.navigate('users-menu');
		});

		screenshot('Updates', async () => {
			await MyApp.navigate('updated');
		});
	}
);

screenshots.start().then(() => {
	console.log('Starting to take screenshots');
});
```

Screenshots in different suites will be placed in different subdirectories. Suite names and screenshot names **MUST NOT** contain `/` characters.

When defining a suite you get access to a bunch of lifecycle methods:

-   `beforeAll` will run when the suite begins
-   `afterAll` will run when the suite finishes
-   `beforeEach` will run before each screenshot
-   `afterEach` will run after each screenshot

These functions all need to return a `Promise<void>`.

The `screenshot(name: string, prepare: () => Promise<void>)` function can be used to define screenshots. It accepts a name as the first parameter and an async function as the second one.

You have to call the `.start()` function to connect to the host software.

##### Lifecycle method call timings

-   Capture Suite
    -   `suite.beforeAll()`
    -   Capture screenshot
        -   `suite.beforeEach()`
        -   `screenshot()`
        -   Take the actual screenshot
        -   `suite.afterEach()`
    -   `suite.afterAll()`

### Need help?

If you have any questions feel free to contact me using Matrix on [#automated-screenshots:systemtest.tk](https://matrix.to/#/#automated-screenshots:systemtest.tk).
