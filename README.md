time spent: ~9 hours

there are `TODO:` and `NOTE:` comments in the code to explain my thought process

# Test Runner

install dependencies with `npm ci` and run the app with `npm run start-tests`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode. `__all-tests.js` file must exist in `./src` folder for it to work.

### `npm run start-tests`

Searches `./src` folder for files ending in `.test.js`, creates `__all-tests.js` file in that folder and starts app in development mode with `npm start`.

## Features
- [x] run single test
- [x] run all filtered tests
- [x] run all filtered failed tests
- [x] filter tests by suite (file name), name and status
- [x] basic flaky tests detection (tests that fail after passing or passed after failing in current run)
- [x] basic statistics (how many tests are visible, passed, failed, how many of those are flaky)
- [x] tests grouping by tests suites
- [x] flexible timeout (1000ms by default, saved in localStorage)
- [x] finds all `.test.js` files in `./src` and its subfolders
- [ ] customizable and robust script
- [ ] move tests to web workers
- [ ] pagination?
- [ ] web workers?
- [ ] custom assertions?