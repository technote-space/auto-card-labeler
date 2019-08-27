import path from 'path';
import signale from 'signale';
import {GitHub} from '@actions/github/lib/github';
import {Context} from '@actions/github/lib/context';
import {parseConfig} from './misc';
import {CONFIG_PATH} from '../constant';

export const getConfig = async (fileName: string, octokit: GitHub, context: Context): Promise<object> => {
    signale.info('Downloading config file: %s', path.posix.join(CONFIG_PATH, fileName));

    const configFile = await octokit.repos.getContents({
        owner: context.repo.owner,
        repo: context.repo.repo,
        path: path.posix.join(CONFIG_PATH, fileName),
    });
    return parseConfig(configFile.data.content);
};
