const makeDummyTest = () => {
    const delay = 7000 + Math.random() * 7000;
    const testPassed = Math.random() > 0.5;

    return callback => {
        window.setTimeout(() => callback(testPassed), delay);
    };
};

const tests = [
    { description: 'uploads go in both directions', run: makeDummyTest() },
    { description: 'PDFs are adequately waterproof', run: makeDummyTest() },
    {
        description: 'videos are heated to 12,000,000 Kelvin',
        run: makeDummyTest()
    },
    { description: 'subpixels can go rock climbing', run: makeDummyTest() },
    {
        description: 'images are squarer than traffic cones',
        run: makeDummyTest()
    },
    { description: "metaproperties don't go too meta", run: makeDummyTest() }
];

export default tests;
