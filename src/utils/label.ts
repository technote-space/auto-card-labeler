import { flatMap, uniq, difference, intersection } from 'lodash';

const getProjectConfig = (config: object, project: string): object => {
	if (project in config) {
		return config[project];
	}
	throw new Error(`project [${project}] is not found.`);
};

const getLabels = (config: object, project: string, column: string): string[] => {
	const projectConfig = getProjectConfig(config, project);
	return column in projectConfig ? ('object' === typeof projectConfig[column] ? uniq(Object.values(projectConfig[column])) : [projectConfig[column]]) : [];
};

const getProjectLabels = (config: object, project: string): string[] => uniq(flatMap(Object.keys(getProjectConfig(config, project)), column => getLabels(config, project, column)));

export const getAddLabels = (currentLabels: string[], project: string, column: string, config: object): string[] => difference(getLabels(config, project, column), currentLabels);

export const getRemoveLabels = (currentLabels: string[], project: string, column: string, config: object): string[] => intersection(currentLabels, difference(getProjectLabels(config, project), getAddLabels([], project, column, config)));
