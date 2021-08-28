"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemoveLabels = exports.getAddLabels = void 0;
const lodash_1 = require("lodash");
const errors_1 = require("../errors");
const misc_1 = require("./misc");
const getProjectConfig = (config, project) => {
    if (project in config) {
        return config[project];
    }
    if ((0, misc_1.isRegexpSearchProject)()) {
        const key = (0, misc_1.findMatched)(Object.keys(config), (0, misc_1.getRegexpSearchProjectFlags)(), project);
        if (key) {
            return config[key];
        }
    }
    throw new errors_1.ProjectNotFoundError(`project [${project}] is not found.`);
};
const extractLabels = (config, column) => {
    if (typeof config[column] === 'string') {
        return [config[column]];
    }
    return (0, lodash_1.uniq)(Object.values(config[column]));
};
const getLabels = (config, project, column) => {
    const projectConfig = getProjectConfig(config, project);
    if (column in projectConfig) {
        return extractLabels(projectConfig, column);
    }
    if ((0, misc_1.isRegexpSearchColumn)()) {
        const key = (0, misc_1.findMatched)(Object.keys(projectConfig), (0, misc_1.getRegexpSearchColumnFlags)(), column);
        if (key) {
            return extractLabels(projectConfig, key);
        }
    }
    return [];
};
const getProjectLabels = (config, project) => (0, lodash_1.uniq)((0, lodash_1.flatMap)(Object.keys(getProjectConfig(config, project)), column => getLabels(config, project, column)));
const getAddLabels = (currentLabels, project, column, config) => (0, lodash_1.difference)(getLabels(config, project, column), currentLabels);
exports.getAddLabels = getAddLabels;
const getRemoveLabels = (currentLabels, project, column, config) => (0, lodash_1.intersection)(currentLabels, (0, lodash_1.difference)(getProjectLabels(config, project), (0, exports.getAddLabels)([], project, column, config)));
exports.getRemoveLabels = getRemoveLabels;
