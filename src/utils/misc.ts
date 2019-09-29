import { getInput } from '@actions/core' ;
import { GitHub } from '@actions/github/lib/github';
import { DEFAULT_CONFIG_FILENAME } from '../constant';

export const getProjectName = async(projectId: number, octokit: GitHub): Promise<string> => {
	const {data: {name}} = await octokit.projects.get({'project_id': projectId});
	return name;
};

export const getColumnName = async(columnId: number, octokit: GitHub): Promise<string> => {
	const {data: {name}} = await octokit.projects.getColumn({'column_id': columnId});
	return name;
};

export const getConfigFilename = (): string => getInput('CONFIG_FILENAME') || DEFAULT_CONFIG_FILENAME;
