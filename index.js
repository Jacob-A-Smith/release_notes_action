const core = require('@actions/core');
const github = require('@actions/github');
const { execSync } = require('child_process');
const { stderr } = require('process');
const fs = require('fs')

console.log('Entering release notes generator')

try {
    console.log(`Path to file: ${core.getInput('path-to-file')}`);

    execSync('git log --pretty=format:"{"hash": "%h", "author": "%an", "email": "%ae", "date": "%ad", "message": "%B"}"', (error, stdout, stderr) => {
        if (error) {
            console.log(`exec error: ${error}`)
            core.setFailed(error.message);
        }
        // console.log(`stdout: ${stdout.toString()}`)
        let strs = stdout.toString().split("}")
        strs.forEach((msg) => {
            console.log(msg)
        });
        // console.error(`stderr: ${stderr}`)

        /*fs.writeFile('release.txt', stdout, (error) => {
            if (error) throw error;
            console.log('SAVED!');
        });*/
    });
} catch (error) {
    core.setFailed(error.message);
}
