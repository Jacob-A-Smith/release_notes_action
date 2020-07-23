const core = require('@actions/core');
const github = require('@actions/github');
// const { spawn } = require('child_process');
// const { stderr, stdout } = require('process');
// const fs = require('fs')

console.log('Entering release notes generator')

try {
    console.log(`Path to file: ${core.getInput('path-to-file')}`);
    // console.log(`The event payload: ${JSON.stringify(github.context.payload, undefined, 2)}`)

    const payload = github.context.payload

    entry = {
        "author": payload.head_commit.author.name,
        "email": payload.head_commit.author.email,
        "message": payload.head_commit.message,
        "date": payload.head_commit.timestamp,
        "git url": payload.head_commit.url
    }
    console.log(`Commit: ${entry}`);


} catch (error) {
    core.setFailed(error.message);
}
