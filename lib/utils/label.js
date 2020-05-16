"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemoveLabels = exports.getAddLabels = void 0;
const lodash_1 = require("lodash");
const getProjectConfig = (config, project) => {
    if (project in config) {
        return config[project];
    }
    throw new Error(`project [${project}] is not found.`);
};
const getLabels = (config, project, column) => {
    const projectConfig = getProjectConfig(config, project);
    return column in projectConfig ? ('object' === typeof projectConfig[column] ? lodash_1.uniq(Object.values(projectConfig[column])) : [projectConfig[column]]) : [];
};
const getProjectLabels = (config, project) => lodash_1.uniq(lodash_1.flatMap(Object.keys(getProjectConfig(config, project)), column => getLabels(config, project, column)));
exports.getAddLabels = (currentLabels, project, column, config) => lodash_1.difference(getLabels(config, project, column), currentLabels);
exports.getRemoveLabels = (currentLabels, project, column, config) => lodash_1.intersection(currentLabels, lodash_1.difference(getProjectLabels(config, project), exports.getAddLabels([], project, column, config)));
