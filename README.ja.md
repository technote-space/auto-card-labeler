# Auto card labeler

[![CI Status](https://github.com/technote-space/auto-card-labeler/workflows/CI/badge.svg)](https://github.com/technote-space/auto-card-labeler/actions)
[![Coverage Status](https://coveralls.io/repos/github/technote-space/auto-card-labeler/badge.svg?branch=master)](https://coveralls.io/github/technote-space/auto-card-labeler?branch=master)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/auto-card-labeler/badge)](https://www.codefactor.io/repository/github/technote-space/auto-card-labeler)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/auto-card-labeler/blob/master/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

これはプロジェクトのカードの移動によって Issue や PullRequest に自動的にラベルを付与する `GitHub Action` です。

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [スクリーンショット](#%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88)
- [インストール](#%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)
- [動作](#%E5%8B%95%E4%BD%9C)
- [オプション](#%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3)
  - [CONFIG_FILENAME](#config_filename)
- [Action イベント詳細](#action-%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E8%A9%B3%E7%B4%B0)
  - [対象イベント](#%E5%AF%BE%E8%B1%A1%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88)
- [このアクションを使用しているアクションの例](#%E3%81%93%E3%81%AE%E3%82%A2%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E3%82%A2%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%AE%E4%BE%8B)
- [Author](#author)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## スクリーンショット
![GitHub Action](https://raw.githubusercontent.com/technote-space/auto-card-labeler/images/screenshot.gif)

## インストール
1. workflow を設定  
   例：`.github/workflows/project_card_moved.yml`
   ```yaml
   on:
     project_card:
       types: [moved]
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
1. アクション用設定の追加  
   例：`.github/card-labeler.yml`
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

## 動作
例：
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

## オプション
### CONFIG_FILENAME
アクション用設定のファイル名  
default: `'card-labeler.yml'`

## Action イベント詳細
### 対象イベント
| eventName | action |
|:---:|:---:|
|project_card|moved|
|project_card|rerequested|

## このアクションを使用しているアクションの例
- [Release GitHub Actions](https://github.com/technote-space/release-github-actions)
  - [project_card_moved.yml](https://github.com/technote-space/release-github-actions/blob/master/.github/workflows/project_card_moved.yml)
- [Auto card labeler](https://github.com/technote-space/auto-card-labeler)
  - [project_card_moved.yml](https://github.com/technote-space/auto-card-labeler/blob/master/.github/workflows/project_card_moved.yml)
- [Assign Author](https://github.com/technote-space/assign-author)
  - [project_card_moved.yml](https://github.com/technote-space/assign-author/blob/master/.github/workflows/project_card_moved.yml)
- [TOC Generator](https://github.com/technote-space/toc-generator)
  - [project_card_moved.yml](https://github.com/technote-space/toc-generator/blob/master/.github/workflows/project_card_moved.yml)
- [Package Version Check Action](https://github.com/technote-space/package-version-check-action)
  - [project_card_moved.yml](https://github.com/technote-space/package-version-check-action/blob/master/.github/workflows/project_card_moved.yml)

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
