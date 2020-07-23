const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('child_process');
const { stderr } = require('process');

console.log('Entering release notes generator')

try {
    console.log(`Path to file: ${core.getInput('path-to-file')}`);

    exec('git log --pretty=format:"{%h, %t, %p  - %an, %ae, %ad: %B}" > log.txt', (error, stdout, stderr) => {
        if (error) {
            console.log(`exec error: ${error}`)
            core.setFailed(error.message);
        }
        console.log(`stdout: ${stdout}`)
        console.error(`stderr: ${stderr}`)
    });
} catch (error) {
    core.setFailed(error.message);
}
