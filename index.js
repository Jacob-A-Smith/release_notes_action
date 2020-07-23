const core = require('@actions/core');
const github = require('@actions/github');
const { spawn } = require('child_process');
const { stderr, stdout } = require('process');
const fs = require('fs')

console.log('Entering release notes generator')

try {
    console.log(`Path to file: ${core.getInput('path-to-file')}`);
    console.log(`The event payload: ${JSON.stringify(github.context.payload, undefined, 2)}`)

    // const stdout = execSync('git log --pretty=format:"{"hash": "%h", "author": "%an", "email": "%ae", "date": "%ad", "message": "%B"}" --all').toString()//, (error, stdout, stderr) => {
    /*    if (error) {
            console.log(`exec error: ${error}`)
            core.setFailed(error.mes-sage);
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
    // let commits = stdout.split("*");
    // commits.forEach(msg => {
    // console.log(msg)
    // });
    let git = spawn('git', ['log', '--pretty=format:"{"hash": "%h", "author": "%an", "email": "%ae", "date": "%ad", "message": "%B"}'])
    let buf = Buffer.alloc(0)
    git.stdout.on('data', (data) => {
        buf = Buffer.concat([buf, data])
    });

    git.stderr.on('data', (data) => {
        console.log(data.toString());
    });

    git.on('close', (code) => {
        let commits = buf.toString().split('\n');
        commits.forEach(msg => {
            console.log(msg)
        });
    });
} catch (error) {
    core.setFailed(error.message);
}
