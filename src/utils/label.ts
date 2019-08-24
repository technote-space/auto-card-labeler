import {flatMap, uniq, difference} from 'lodash';

const getLabels = (config: object, project: string, column: string) => column in config[project] ? ('object' === typeof config[project][column] ? uniq(Object.values(config[project][column])) : [config[project][column]]) : [];

const getProjectLabels = (config: object, project: string) => uniq(flatMap(Object.keys(config[project]), column => getLabels(config, project, column)));

export const getRemoveLabels = (project: string, column: string, config: object) => difference(getProjectLabels(config, project), getAddLabels(project, column, config));

export const getAddLabels = (project: string, column: string, config: object) => getLabels(config, project, column);
