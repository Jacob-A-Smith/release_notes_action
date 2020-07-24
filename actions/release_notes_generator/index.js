const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

console.log('Entering release notes generator')

try {
    const payload = github.context.payload
    console.log(`The event payload: ${JSON.stringify(github.context.payload, undefined, 2)}`)

    const pathToFile = core.getInput('path-to-file');
    const branch = core.getInput('branch-name');
    console.log(`BRANCH NAME: ${branch} --- PATH TO FILE: ${pathToFile}`);


    /* entry = {
         "author": payload.head_commit.author.name,
         "email": payload.head_commit.author.email,
         "message": payload.head_commit.message,
         "date": payload.head_commit.timestamp,
         "git url": payload.head_commit.url
     }*/
    let entries = []
    for (i = 0; i < payload.commits.length; ++i) {
        entries.push({
            "author": payload.commits[i].author.name,
            "email": payload.commits[i].author.email,
            "message": payload.commits[i].message,
            "date": payload.commits[i].timestamp,
            "git url": payload.commits[i].url
        })
    }
    console.log(`Commits: ${JSON.stringify(entries, undefined, 2)}`);

    let prevCommits = readPrevCommits(pathToFile)
    prevCommits.history.concat(entries)
    // entries.forEach((entry) => {
    // prevCommits.history.push(entry)
    // })

    fs.writeFile(pathToFile, JSON.stringify(prevCommits, undefined, 2), err => {
        if (err) throw err;
        console.log("done writing");
    });

} catch (error) {
    core.setFailed(error.message);
}

function readPrevCommits(filepath) {
    let data = fs.readFileSync(filepath, 'utf8').toString()
    if (data) {
        try {
            prevCommits = JSON.parse(data)
        } catch (e) {
            console.log(`error parsing: ${e}`);
        }
    }
    return { "history": [] };
}
/*
function getSummary(commits) {
    console.log("Reduce commits")
    return commits.reduce((total, currentVal) => {
        return total += currentVal.message + ", "
    })
}*/