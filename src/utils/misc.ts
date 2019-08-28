import fs from 'fs';
import yaml from 'js-yaml';
import signale from 'signale';
import {getInput} from '@actions/core' ;
import {GitHub} from '@actions/github/lib/github';
import {Context} from '@actions/github/lib/context';
import {TARGET_EVENT_NAME, TARGET_EVENT_ACTION, DEFAULT_CONFIG_FILENAME} from '../constant';

export const isTargetEvent = (context: Context): boolean => TARGET_EVENT_NAME === context.eventName && TARGET_EVENT_ACTION === context.payload.action;

export const parseConfig = (content: string): object => yaml.safeLoad(Buffer.from(content, 'base64').toString()) || {};

export const getProjectName = async (projectId: number, octokit: GitHub): Promise<string> => {
    signale.info('Getting project name: %d', projectId);

    const {data: {name}} = await octokit.projects.get({project_id: projectId});
    return name;
};

export const getColumnName = async (columnId: number, octokit: GitHub): Promise<string> => {
    signale.info('Getting column name: %d', columnId);

    const {data: {name}} = await octokit.projects.getColumn({column_id: columnId});
    return name;
};

export const getConfigFilename = (): string => getInput('CONFIG_FILENAME') || DEFAULT_CONFIG_FILENAME;

export const getBuildVersion = (filepath: string): string | boolean => {
    if (!fs.existsSync(filepath)) {
        return false;
    }

    const json = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    if (json && 'tagName' in json) {
        return json['tagName'];
    }

    return false;
};
