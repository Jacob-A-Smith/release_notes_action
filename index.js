const core = require('@actions/core');
const github = require('@actions/github');

console.log('Entering release notes generator')

try {
    console.log(`Path to file: ${core.getInput('path-to-file')}`);
} catch (error) {
    core.setFailed(error.message);
}
