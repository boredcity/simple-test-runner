const makeDummyTest = () => {
    return callback => {
        const delay = 700 + Math.random() * 700;
        window.setTimeout(() => {
            const testPassed = Math.random() > 0.5;
            callback(testPassed);
        }, delay);
    };
};

const tests = [
    { description: 'This is test from example2', run: makeDummyTest() }
];

export default tests;
