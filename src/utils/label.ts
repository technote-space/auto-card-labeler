import {flatMap, uniq, difference, intersection} from 'lodash';
import {ProjectNotFoundError} from '../errors';
import {isRegexpSearchProject, getRegexpSearchProjectFlags, isRegexpSearchColumn, getRegexpSearchColumnFlags} from './misc';

type ProjectConfigType = {
  [key: string]: string | string[];
};
type ConfigType = {
  [key: string]: ProjectConfigType;
};

const getProjectConfig = (config: ConfigType, project: string): ProjectConfigType => {
  if (isRegexpSearchProject()) {
    const key = Object.keys(config).find(key => new RegExp(key, getRegexpSearchProjectFlags()).test(project));
    if (key) {
      return config[key];
    }
  } else {
    if (project in config) {
      return config[project];
    }
  }

  throw new ProjectNotFoundError(`project [${project}] is not found.`);
};

const extractLabels = (config: ProjectConfigType, column: string): string[] => {
  if (typeof config[column] === 'string') {
    return [config[column] as string];
  }

  return uniq(Object.values(config[column]));
};
const getLabels     = (config: ConfigType, project: string, column: string): string[] => {
  const projectConfig = getProjectConfig(config, project);
  if (isRegexpSearchColumn()) {
    const key = Object.keys(projectConfig).find(key => new RegExp(key, getRegexpSearchColumnFlags()).test(column));
    if (key) {
      return extractLabels(projectConfig, key);
    }
  } else {
    if (column in projectConfig) {
      return extractLabels(projectConfig, column);
    }
  }

  return [];
};

const getProjectLabels = (config: ConfigType, project: string): string[] => uniq(flatMap(Object.keys(getProjectConfig(config, project)), column => getLabels(config, project, column)));

export const getAddLabels = (currentLabels: string[], project: string, column: string, config: ConfigType): string[] => difference(getLabels(config, project, column), currentLabels);

export const getRemoveLabels = (currentLabels: string[], project: string, column: string, config: ConfigType): string[] => intersection(currentLabels, difference(getProjectLabels(config, project), getAddLabels([], project, column, config)));
