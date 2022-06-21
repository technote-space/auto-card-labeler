import { Utils } from '@technote-space/github-action-helper';
import { ProjectNotFoundError } from '../errors';
import { isRegexpSearchProject, getRegexpSearchProjectFlags, isRegexpSearchColumn, getRegexpSearchColumnFlags, findMatched } from './misc';

type ProjectConfigType = {
  [key: string]: string | string[];
};
type ConfigType = {
  [key: string]: ProjectConfigType;
};

const getProjectConfig = (config: ConfigType, project: string): ProjectConfigType => {
  if (project in config) {
    return config[project];
  }

  if (isRegexpSearchProject()) {
    const key = findMatched(Object.keys(config), getRegexpSearchProjectFlags(), project);
    if (key) {
      return config[key];
    }
  }

  throw new ProjectNotFoundError(`project [${project}] is not found.`);
};

const extractLabels = (config: ProjectConfigType, column: string): string[] => {
  if (typeof config[column] === 'string') {
    return [config[column] as string];
  }

  return Utils.uniqueArray(Object.values(config[column]));
};
const getLabels     = (config: ConfigType, project: string, column: string): string[] => {
  const projectConfig = getProjectConfig(config, project);
  if (column in projectConfig) {
    return extractLabels(projectConfig, column);
  }

  if (isRegexpSearchColumn()) {
    const key = findMatched(Object.keys(projectConfig), getRegexpSearchColumnFlags(), column);
    if (key) {
      return extractLabels(projectConfig, key);
    }
  }

  return [];
};

const getProjectLabels = (config: ConfigType, project: string): string[] => Utils.uniqueArray(Object.keys(getProjectConfig(config, project)).flatMap(column => getLabels(config, project, column)));

export const getAddLabels = (currentLabels: string[], project: string, column: string, config: ConfigType): string[] => getLabels(config, project, column).filter(label => !currentLabels.includes(label));

export const getRemoveLabels = (currentLabels: string[], project: string, column: string, config: ConfigType): string[] => {
  const addLabels    = getAddLabels([], project, column, config);
  const removeLabels = getProjectLabels(config, project).filter(label => !addLabels.includes(label));
  return currentLabels.filter(label => removeLabels.includes(label));
};
