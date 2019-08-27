import yaml from 'js-yaml';
import signale from 'signale';
import {getInput} from '@actions/core' ;
import {GitHub} from '@actions/github/lib/github';
import {Context} from '@actions/github/lib/context';
import {TARGET_EVENT_NAME, TARGET_EVENT_ACTION, DEFAULT_CONFIG_FILENAME} from '../constant';

export const isTargetEvent = (context: Context) => TARGET_EVENT_NAME === context.eventName && TARGET_EVENT_ACTION === context.payload.action;

export const parseConfig = (content: string) => yaml.safeLoad(Buffer.from(content, 'base64').toString()) || {};

export const getProjectName = async (projectId: number, octokit: GitHub) => {
    signale.info('Getting project name');

    const {data: {name}} = await octokit.projects.get({project_id: projectId});
    return name;
};

export const getColumnName = async (columnId: number, octokit: GitHub) => {
    signale.info('Getting column name');

    const {data: {name}} = await octokit.projects.getColumn({column_id: columnId});
    return name;
};

export const getConfigFilename = (): string => getInput('CONFIG_FILENAME') || DEFAULT_CONFIG_FILENAME;
