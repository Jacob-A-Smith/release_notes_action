const core = require('@actions/core');
const github = require('@actions/github');
// const { spawn } = require('child_process');
// const { stderr, stdout } = require('process');
const fs = require('fs');

console.log('Entering release notes generator')

try {
    const payload = github.context.payload
    console.log(`The event payload: ${JSON.stringify(github.context.payload, undefined, 2)}`)

    const pathToFile = core.getInput('path-to-file');
    const branch = core.getInput('branch-name');
    console.log(`BRANCH NAME: ${branch} --- PATH TO FILE: ${pathToFile}`);


    entry = {
        "author": payload.head_commit.author.name,
        "email": payload.head_commit.author.email,
        "message": payload.head_commit.message,
        "date": payload.head_commit.timestamp,
        "git url": payload.head_commit.url,
        "summary": getSummary(payload.commits)
    }
    console.log(`Commit: ${JSON.stringify(entry, undefined, 2)}`);

    let prevCommits = JSON.parse(fs.readFileSync(pathToFile, 'utf8').toString(), undefined, 2) || { "history": [] };
    // prevCommits = prevCommits || { "history": [] };
    // if (prevCommits === undefined) {
    // prevCommits = {
    // "history": []
    // }
    // }

    // if (!())
    prevCommits["history"].push(entry)

    // payload.base_ref
    /*switch (payload.ref) {
        case master:
            console.log("MASTER")
            appendToMaster(entry, prevCommits, "master")
            break;
        case staging:
            console.log("STAGING")
            appendToStaging(entry, prevCommits, "staging")
            break;
        case develop:
            console.log("DEVELOP")
            appendToDevelop(entry, prevCommits, "develop")
            break;
        default:
            console.log("DEFAULT")
            appendToDevelop(entry, prevCommits, payload.ref)
            break;
    }*/

    fs.writeFile(pathToFile, JSON.stringify(prevCommits, undefined, 2), err => {
        if (err) throw err;
        console.log("done writing");
    });

} catch (error) {
    core.setFailed(error.message);
}
/*
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
*/

function getSummary(commits) {
    console.log("Reduce commits")
    return commits.reduce((total, currentVal) => {
        return total += currentVal.message + ", "
    })
}