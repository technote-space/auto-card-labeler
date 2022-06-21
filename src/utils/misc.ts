import { getInput } from '@actions/core' ;
import { Octokit } from '@technote-space/github-action-helper/dist/types';
import { Utils } from '@technote-space/github-action-helper';

export const getProjectName = async(projectId: number, octokit: Octokit): Promise<string> => (await octokit.rest.projects.get({ 'project_id': projectId })).data.name;

export const getColumnName = async(columnId: number, octokit: Octokit): Promise<string> => (await octokit.rest.projects.getColumn({ 'column_id': columnId })).data.name;

export const getConfigFilename = (): string => getInput('CONFIG_FILENAME', { required: true });

export const isProjectConfigRequired = (): boolean => Utils.getBoolValue(getInput('PROJECT_CONFIG_IS_REQUIRED'));

export const isRegexpSearchProject       = (): boolean => Utils.getBoolValue(getInput('SEARCH_PROJECT_BY_REGEXP'));
export const getRegexpSearchProjectFlags = (): string => getInput('SEARCH_PROJECT_REGEXP_FLAGS');
export const isRegexpSearchColumn        = (): boolean => Utils.getBoolValue(getInput('SEARCH_COLUMN_BY_REGEXP'));
export const getRegexpSearchColumnFlags  = (): string => getInput('SEARCH_COLUMN_REGEXP_FLAGS');

export const findMatched = (items: string[], flags: string, string: string): string | undefined => {
  return items.find(item => {
    try {
      return (new RegExp(item, flags)).test(string);
    } catch {
      return false;
    }
  });
};
