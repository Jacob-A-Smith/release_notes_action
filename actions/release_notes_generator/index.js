const core = require('@actions/core');
const github = require('@actions/github');
// const { spawn } = require('child_process');
// const { stderr, stdout } = require('process');
const fs = require('fs');
const { stringify } = require('querystring');

console.log('Entering release notes generator')

try {
    // console.log(`Path to file: ${core.getInput('path-to-file')}`);
    console.log(`The event payload: ${JSON.stringify(github.context.payload, undefined, 2)}`)
    // console.log(`REF: ${core.getInput('branch-name')}`);

    const payload = github.context.payload
    const pathToFile = core.getInput('path-to-file');
    const master = core.getInput('master-branch');
    const staging = core.getInput('staging-branch')
    const develop = core.getInput('develop-branch')

    // let refs = stringify(github.context.payload.ref).split("/")[2] // ?
    // console.log(`REFS: Master: ${master} - Staging: ${staging} - Develop: ${develop}`);

    entry = {
        "author": payload.head_commit.author.name,
        "email": payload.head_commit.author.email,
        "message": payload.head_commit.message,
        "date": payload.head_commit.timestamp,
        "git url": payload.head_commit.url
    }
    console.log(`Commit: ${JSON.stringify(entry, undefined, 2)}`);

    let prevCommits = JSON.parse(fs.readFileSync(pathToFile, 'utf8').toString(), undefined, 2);

    switch (payload.ref) {
        case master:
            console.log("MASTER")
            appendToMaster(entry, prevCommits, "master")
            break;
        case staging:
            console.log("STAGING")
            // appendToStaging(commit)
            break;
        case develop:
            console.log("DEVELOP")
            // appendToDevelop(entry, prevCommits, "develop")
            break;
        default:
            console.log("DEFAULT")
            break;
    }

    fs.writeFile(pathToFile, JSON.stringify(prevCommits, undefined, 2), err => {
        if (err) throw err;
        console.log("done writing");
    });
} catch (error) {
    core.setFailed(error.message);
}

function appendToMaster(commit, prevCommits, branchRef) {
    if (!(branchRef in prevCommits)) {
        prevCommits[branchRef] = []
    }
    prevCommits[branchRef].push(commit)
}

function appendToStaging(commit, prevCommits, branchRef) {
    if (!(branchRef in prevCommits)) {
        prevCommits[branchRef] = []
    }
    prevCommits[branchRef].push(commit)
}

function appendToDevelop(commit, prevCommits, branchRef) {
    if (!(branchRef in prevCommits)) {
        prevCommits[branchRef] = []
    }
    prevCommits[branchRef].push(commit)
}