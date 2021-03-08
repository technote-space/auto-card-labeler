import {getInput} from '@actions/core' ;
import {Octokit} from '@technote-space/github-action-helper/dist/types';
import {Utils} from '@technote-space/github-action-helper';

export const getProjectName = async(projectId: number, octokit: Octokit): Promise<string> => (await octokit.projects.get({'project_id': projectId})).data.name;

export const getColumnName = async(columnId: number, octokit: Octokit): Promise<string> => (await octokit.projects.getColumn({'column_id': columnId})).data.name;

export const getConfigFilename = (): string => getInput('CONFIG_FILENAME', {required: true});

export const isProjectConfigRequired = (): boolean => Utils.getBoolValue(getInput('PROJECT_CONFIG_IS_REQUIRED'));
