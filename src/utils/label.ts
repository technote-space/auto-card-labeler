import { flatMap, uniq, difference, intersection } from 'lodash';

const getLabels = (config: object, project: string, column: string): string[] => column in config[project] ? ('object' === typeof config[project][column] ? uniq(Object.values(config[project][column])) : [config[project][column]]) : [];

const getProjectLabels = (config: object, project: string): string[] => uniq(flatMap(Object.keys(config[project]), column => getLabels(config, project, column)));

export const getAddLabels = (currentLabels: string[], project: string, column: string, config: object): string[] => difference(getLabels(config, project, column), currentLabels);

export const getRemoveLabels = (currentLabels: string[], project: string, column: string, config: object): string[] => intersection(currentLabels, difference(getProjectLabels(config, project), getAddLabels([], project, column, config)));
