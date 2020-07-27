# Release notes generator action

This action logs commit history to a specified file

## Inputs

### `path-to-file`

**Required** The filepath for the action to log commit history to.

## Outputs

### `success`

*TODO: Not yet implemented*

Indication of success of failure.

## Example usage

uses: actions/release_notes_generator
with:
  who-to-greet: ./release_notes.json

## TODO:
- implement or remove success output
- abstract to a git history logger action
- extract jira ticket ?
- handle failure to write data to file
- Add blacklist
- create file if it does not exist