const fs = require('fs/promises');
const path = require('path');

// TODO: test paths handling on windows

const startDir = process.env.START_DIRECTORY;
const resultDir = process.env.RESULT_DIRECTORY;
const TEST_FILE_POSTFIX = process.env.TEST_FILE_POSTFIX ?? '.test.js'; // TODO: support glob pattern
// TODO: support custom dirs; for now only "./src" works
if (!startDir) throw new Error('Provide START_DIRECTORY env');
if (!resultDir) throw new Error('Provide RESULT_DIRECTORY env');


async function getFiles(pathToCheck) {
    const filesAndDirectories = await fs.readdir(pathToCheck, {
        withFileTypes: true
    });

    let files = [];

    for (const entry of filesAndDirectories) {
        if (entry.isDirectory()) {
            files.push(...(await getFiles(path.join(pathToCheck, entry.name))));
        } else {
            if (entry.name.endsWith(TEST_FILE_POSTFIX)) {
                files.push({
                    path: path
                        .join(pathToCheck, entry.name)
                        .replace('src', '.'), // TODO: support other paths
                    name: entry.name
                });
            }
        }
    }

    return files;
}

async function main() {
    const files = await getFiles(startDir);

    // TODO: escape path properly
    const text = `
${files.map((f, i) => `import f${i} from "${f.path}";\n`).join('')}
const tests = [
${files
    .map(
        (f, i) => `    ...f${i}.map(test => {
        test.suite = "${f.name}";
        return test;
    }),\n`
    )
    .join('')}
];

export default tests;
`;
    // TODO: create dir before writing file if it doesn't exist
    await fs.writeFile(path.join(resultDir, '__all-tests.js'), text);
}

main();
