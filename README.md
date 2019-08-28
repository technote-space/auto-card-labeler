# Auto card labeler

[![Build Status](https://github.com/technote-space/auto-card-labeler/workflows/Build/badge.svg)](https://github.com/technote-space/auto-card-labeler/actions)
[![Coverage Status](https://coveralls.io/repos/github/technote-space/auto-card-labeler/badge.svg?branch=master)](https://coveralls.io/github/technote-space/auto-card-labeler?branch=master)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/auto-card-labeler/badge)](https://www.codefactor.io/repository/github/technote-space/auto-card-labeler)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/auto-card-labeler/blob/master/LICENSE)

GitHub actions to auto label a pull request or an issue based on project card move.

## Screenshot
![GitHub Action](https://raw.githubusercontent.com/technote-space/auto-card-labeler/images/screenshot.gif)

## Installation
1. Setup workflow  
   e.g. `.github/workflows/project_card_moved.yml`
   ```yaml
   on: project_card
   name: Project Card Event
   jobs:
     triage:
       name: Auto card labeler
       runs-on: ubuntu-latest
       steps:
         - name: Auto card labeler
           uses: technote-space/auto-card-labeler@v1
           with:
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   ```
1. Setup action setting  
   e.g. `.github/card-labeler.yml`
   ```yaml
   Project name1:
     Column name1:
       - 'Status: test1'
     Column name2:
       - 'Status: test2-1'
       - 'Status: test2-2'
   Project name2:
     Column name3:
       - 'Status: test1'
   ```

## Behavior
e.g.
```yaml
Project name1:
  Column name1:
    - 'Status: test1'
  Column name2:
    - 'Status: test2-1'
    - 'Status: test2-2'
```
1. Card created (`Column name1`)
   - Add
     - `Status: test1`
   - Remove
     - None
   - Current Labels
     - `Status: test1`
1. Card moved to `Column name2`
   - Add
     - `Status: test2-1`
     - `Status: test2-2`
   - Remove
     - `Status: test1`
   - Current Labels
     - `Status: test2-1`
     - `Status: test2-2`
1. Card moved to `Column name3`
   - Add
     - None
   - Remove
     - `Status: test2-1`
     - `Status: test2-2`
   - Current Labels
     - None
1. Card moved to `Column name1`
   - Add
     - `Status: test1`
   - Remove
     - None
   - Current Labels
     - `Status: test1`

## Options
### CONFIG_FILENAME
Config file name.  
default: `'card-labeler.yml'`

## Action event details
### Target event
- project_card
### Target action
- moved

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
