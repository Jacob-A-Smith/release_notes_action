const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('child_process');
const { stderr } = require('process');
const fs = require('fs')

console.log('Entering release notes generator')

try {
    console.log(`Path to file: ${core.getInput('path-to-file')}`);

    exec('git log --pretty=format:"{%h - %an, %ae, %ad: %B}"', (error, stdout, stderr) => {
        if (error) {
            console.log(`exec error: ${error}`)
            core.setFailed(error.message);
        }
        console.log(`stdout: ${stdout}`)
        console.error(`stderr: ${stderr}`)

        fs.writeFile('release.txt', stdout, (error) => {
            if (error) throw error;
            console.log('SAVED!');
        });
    });
} catch (error) {
    core.setFailed(error.message);
}
