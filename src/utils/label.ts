import {flatMap, uniq, difference, intersection} from 'lodash';
import {ProjectNotFoundError} from '../errors';

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

  throw new ProjectNotFoundError(`project [${project}] is not found.`);
};

const getLabels = (config: ConfigType, project: string, column: string): string[] => {
  const projectConfig = getProjectConfig(config, project);
  if (column in projectConfig) {
    if (typeof projectConfig[column] === 'string') {
      return [projectConfig[column] as string];
    }

    return uniq(Object.values(projectConfig[column]));
  }

  return [];
};

const getProjectLabels = (config: ConfigType, project: string): string[] => uniq(flatMap(Object.keys(getProjectConfig(config, project)), column => getLabels(config, project, column)));

export const getAddLabels = (currentLabels: string[], project: string, column: string, config: ConfigType): string[] => difference(getLabels(config, project, column), currentLabels);

export const getRemoveLabels = (currentLabels: string[], project: string, column: string, config: ConfigType): string[] => intersection(currentLabels, difference(getProjectLabels(config, project), getAddLabels([], project, column, config)));
