import yaml from 'js-yaml';
import {GitHub} from '@actions/github/lib/github';

export const parseConfig = (content: string) => yaml.safeLoad(Buffer.from(content, 'base64').toString()) || {};

export const getProjectName = async (projectId: number, octokit: GitHub) => {
    const {data: {name}} = await octokit.projects.get({project_id: projectId});
    return name;
};

export const getColumnName = async (columnId: number, octokit: GitHub) => {
    const {data: {name}} = await octokit.projects.getColumn({column_id: columnId});
    return name;
};
