import yaml from 'js-yaml';
import {GitHub} from '@actions/github/lib/github';
import {Context} from '@actions/github/lib/context';
import {TARGET_EVENT_NAME, TARGET_EVENT_ACTION} from '../constant';

export const isTargetEvent = (context: Context) => TARGET_EVENT_NAME === context.eventName && TARGET_EVENT_ACTION === context.payload.action;

export const parseConfig = (content: string) => yaml.safeLoad(Buffer.from(content, 'base64').toString()) || {};

export const getProjectName = async (projectId: number, octokit: GitHub) => {
    const {data: {name}} = await octokit.projects.get({project_id: projectId});
    return name;
};

export const getColumnName = async (columnId: number, octokit: GitHub) => {
    const {data: {name}} = await octokit.projects.getColumn({column_id: columnId});
    return name;
};
