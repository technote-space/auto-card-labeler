"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemoveLabels = exports.getAddLabels = void 0;
const lodash_1 = require("lodash");
const errors_1 = require("../errors");
const misc_1 = require("./misc");
const getProjectConfig = (config, project) => {
    if (misc_1.isRegexpSearchProject()) {
        const key = Object.keys(config).find(key => new RegExp(key, misc_1.getRegexpSearchProjectFlags()).test(project));
        if (key) {
            return config[key];
        }
    }
    else {
        if (project in config) {
            return config[project];
        }
    }
    throw new errors_1.ProjectNotFoundError(`project [${project}] is not found.`);
};
const extractLabels = (config, column) => {
    if (typeof config[column] === 'string') {
        return [config[column]];
    }
    return lodash_1.uniq(Object.values(config[column]));
};
const getLabels = (config, project, column) => {
    const projectConfig = getProjectConfig(config, project);
    if (misc_1.isRegexpSearchColumn()) {
        const key = Object.keys(projectConfig).find(key => new RegExp(key, misc_1.getRegexpSearchColumnFlags()).test(column));
        if (key) {
            return extractLabels(projectConfig, key);
        }
    }
    else {
        if (column in projectConfig) {
            return extractLabels(projectConfig, column);
        }
    }
    return [];
};
const getProjectLabels = (config, project) => lodash_1.uniq(lodash_1.flatMap(Object.keys(getProjectConfig(config, project)), column => getLabels(config, project, column)));
const getAddLabels = (currentLabels, project, column, config) => lodash_1.difference(getLabels(config, project, column), currentLabels);
exports.getAddLabels = getAddLabels;
const getRemoveLabels = (currentLabels, project, column, config) => lodash_1.intersection(currentLabels, lodash_1.difference(getProjectLabels(config, project), exports.getAddLabels([], project, column, config)));
exports.getRemoveLabels = getRemoveLabels;
