# GitHub Action Config Helper

[![npm version](https://badge.fury.io/js/%40technote-space%2Fgithub-action-config-helper.svg)](https://badge.fury.io/js/%40technote-space%2Fgithub-action-config-helper)
[![CI Status](https://github.com/technote-space/github-action-config-helper/workflows/CI/badge.svg)](https://github.com/technote-space/github-action-config-helper/actions)
[![codecov](https://codecov.io/gh/technote-space/github-action-config-helper/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/github-action-config-helper)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/github-action-config-helper/badge)](https://www.codefactor.io/repository/github/technote-space/github-action-config-helper)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/github-action-config-helper/blob/master/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

Helper for GitHub Actions to get config from the repository where the action is running.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Usage](#usage)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage
1. Install  
`npm i @technote-space/github-action-config-helper`
1. 
```js
import { getConfig } from '@technote-space/github-action-config-helper';
import { getInput } from '@actions/core';
import { context, GitHub } from '@actions/github';

...

const config = await getConfig('config.yml', new GitHub(getInput('GITHUB_TOKEN', {required: true})), context);
```

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
