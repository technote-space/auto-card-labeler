import path from 'path';
import {GitHub} from '@actions/github/lib/github';
import {Context} from '@actions/github/lib/context';
import {parseConfig} from './misc';
import {CONFIG_PATH} from '../constant';

export const getConfig: Function = async (fileName: string, octokit: GitHub, context: Context) => parseConfig(
    (await octokit.repos.getContents({
        owner: context.repo.owner,
        repo: context.repo.repo,
        path: path.posix.join(CONFIG_PATH, fileName),
    })).data.content,
);
