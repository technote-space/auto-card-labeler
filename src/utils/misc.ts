import { getInput } from '@actions/core' ;
import { GitHub } from '@actions/github/lib/github';

export const getProjectName = async(projectId: number, octokit: GitHub): Promise<string> => (await octokit.projects.get({'project_id': projectId})).data.name;

export const getColumnName = async(columnId: number, octokit: GitHub): Promise<string> => (await octokit.projects.getColumn({'column_id': columnId})).data.name;

export const getConfigFilename = (): string => getInput('CONFIG_FILENAME', {required: true});
