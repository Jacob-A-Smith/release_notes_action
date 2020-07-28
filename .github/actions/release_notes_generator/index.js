const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

function readPrevCommits(filepath) {
    let data = fs.readFileSync(filepath, 'utf8').toString();
    if (data) {
        try {
            let prevCommits = JSON.parse(data);
            return prevCommits;
        } catch (e) {
            console.log(`error parsing log file: ${e}`);
        }
    }
    return { "entries": [] };
}

function parseCommits(commits, blacklist) {
    console.log(` > PARSE COMMIT:\n\tCOMMITS\n\t${JSON.stringify(commits, undefined, 2)}\n\t${JSON.stringify(blacklist)}`);
    let commitData = [];
    for (let i = 0; i < commits.length; ++i) {
        console.log(`Author: ${commits[i].author.email}`)
        if (blacklist.indexOf(commits[i].author.email) >= 0) {
            continue;
        }
        commitData.push({
            "author": commits[i].author.name,
            "email": commits[i].author.email,
            "message": commits[i].message,
            "date": commits[i].timestamp,
            "gitURL": commits[i].url
        });
    }
    return commitData
}

console.log('Entering release notes generator')
try {
    // SETUP //
    const payload = github.context.payload;
    const pathToFile = core.getInput('path-to-file');
    const blacklist = core.getInput('blacklist').split(',');
    console.log(` > Path to log file: ${pathToFile}`);
    console.log(` > Blacklist: ${JSON.stringify(blacklist)}`);
    // console.log(`The event payload: ${JSON.stringify(github.context.payload, undefined, 2)}`);

    // PARSE GIT DATA //
    let entries = parseCommits(payload.commits, blacklist)
    console.log(` > Payload parsed, ${entries.length} new commit(s) detected`)
    // console.log(`COMMITS: ${JSON.stringify(entries, undefined, 2)}`);

    // READ IN PREVIOUS ENTRIES //
    let history = readPrevCommits(pathToFile);
    console.log(` > Commit history parsed, ${history.entries.length} previous entries read`);
    // console.log(`PREVIOUS ENTRIES: \n${JSON.stringify(history, undefined, 2)}`);

    // APPEND NEW DATA TO OLD //
    if (entries.length > 0) {
        history.entries.push(entries);
        console.log(` > Added new entry to log file, ${history.entries.length} entries total`);
        // console.log(`UPDATED ENTRIES: \n${JSON.stringify(history, undefined, 2)}`);
    }

    // WRITE DATA & EXIT //
    fs.writeFile(pathToFile, JSON.stringify(history, undefined, 2), err => {
        if (err) {
            throw err;
        }
        console.log(` > Done logging commit(s) to file: ${pathToFile}`);
        console.log('Exiting release notes generator safely');
    });
} catch (error) {
    // NOTE:
    // should probably do something if there is an error with
    // pushing new entries to the file

    console.log(`Exception generating release notes: ${error}`);
    core.setFailed(error.message);
}