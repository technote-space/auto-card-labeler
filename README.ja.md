# Auto card labeler

[![CI Status](https://github.com/technote-space/auto-card-labeler/workflows/CI/badge.svg)](https://github.com/technote-space/auto-card-labeler/actions)
[![codecov](https://codecov.io/gh/technote-space/auto-card-labeler/branch/main/graph/badge.svg)](https://codecov.io/gh/technote-space/auto-card-labeler)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/auto-card-labeler/badge)](https://www.codefactor.io/repository/github/technote-space/auto-card-labeler)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/auto-card-labeler/blob/main/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

これはプロジェクトのカードの移動によって Issue や PullRequest に自動的にラベルを付与する `GitHub Actions` です。

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [スクリーンショット](#%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88)
- [使用方法](#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)
- [動作](#%E5%8B%95%E4%BD%9C)
- [オプション](#%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3)
- [Action イベント詳細](#action-%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E8%A9%B3%E7%B4%B0)
  - [対象イベント](#%E5%AF%BE%E8%B1%A1%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## スクリーンショット
![GitHub Action](https://raw.githubusercontent.com/technote-space/auto-card-labeler/images/screenshot.gif)

## 使用方法
1. workflow を設定  
   例：`.github/workflows/project-card-moved.yml`
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
         - uses: technote-space/auto-card-labeler@v2
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
| name | description | default | required | e.g. |
|:---:|:---|:---:|:---:|:---:|
| CONFIG_FILENAME | アクション用設定のファイル名 | `card-labeler.yml` | true | `card-labeler-setting.yml` |
| GITHUB_TOKEN | アクセストークン | `${{github.token}}` | true | `${{secrets.ACCESS_TOKEN}}` |

## Action イベント詳細
### 対象イベント
| eventName | action |
|:---:|:---:|
|project_card|moved|
|project_card|created|

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
