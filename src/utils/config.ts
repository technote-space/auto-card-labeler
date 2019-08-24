import path from 'path';
import {GitHub} from '@actions/github/lib/github';
import {parseConfig} from './misc';
import {CONFIG_PATH} from '../constant';

export const getConfig: Function = async (owner: string, repo: string, fileName: string, octokit: GitHub) => parseConfig(
    (await octokit.repos.getContents({
        owner,
        repo,
        path: path.posix.join(CONFIG_PATH, fileName),
    })).data.content,
);
