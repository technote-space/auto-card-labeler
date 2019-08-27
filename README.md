# Auto card labeler

[![Build Status](https://github.com/technote-space/auto-card-labeler/workflows/Build/badge.svg)](https://github.com/technote-space/auto-card-labeler/actions)
[![Coverage Status](https://coveralls.io/repos/github/technote-space/auto-card-labeler/badge.svg?branch=master)](https://coveralls.io/github/technote-space/auto-card-labeler?branch=master)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/auto-card-labeler/badge)](https://www.codefactor.io/repository/github/technote-space/auto-card-labeler)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/auto-card-labeler/blob/master/LICENSE)

GitHub actions to auto label a pull request or an issue based on project card move.

## Screenshot

## Installation
.github/workflows/project_card_moved.yml
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
