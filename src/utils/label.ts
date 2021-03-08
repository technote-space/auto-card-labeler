import {flatMap, uniq, difference, intersection} from 'lodash';
import {ProjectNotFoundError} from '../errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProjectConfig = (config: { [key: string]: any }, project: string): any => {
  if (project in config) {
    return config[project];
  }

  throw new ProjectNotFoundError(`project [${project}] is not found.`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLabels = (config: { [key: string]: any }, project: string, column: string): string[] => {
  const projectConfig = getProjectConfig(config, project);
  return column in projectConfig ? ('object' === typeof projectConfig[column] ? uniq(Object.values(projectConfig[column])) : [projectConfig[column]]) : [];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProjectLabels = (config: { [key: string]: any }, project: string): string[] => uniq(flatMap(Object.keys(getProjectConfig(config, project)), column => getLabels(config, project, column)));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAddLabels = (currentLabels: string[], project: string, column: string, config: { [key: string]: any }): string[] => difference(getLabels(config, project, column), currentLabels);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRemoveLabels = (currentLabels: string[], project: string, column: string, config: { [key: string]: any }): string[] => intersection(currentLabels, difference(getProjectLabels(config, project), getAddLabels([], project, column, config)));
