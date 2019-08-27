import {flatMap, uniq, difference, intersection} from 'lodash';

const getLabels = (config: object, project: string, column: string) => column in config[project] ? ('object' === typeof config[project][column] ? uniq(Object.values(config[project][column])) : [config[project][column]]) : [];

const getProjectLabels = (config: object, project: string) => uniq(flatMap(Object.keys(config[project]), column => getLabels(config, project, column)));

export const getRemoveLabels = (currentLabels: string[], project: string, column: string, config: object) => intersection(currentLabels, difference(getProjectLabels(config, project), getAddLabels([], project, column, config)));

export const getAddLabels = (currentLabels: string[], project: string, column: string, config: object) => difference(getLabels(config, project, column), currentLabels);
