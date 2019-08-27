"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const getLabels = (config, project, column) => column in config[project] ? ('object' === typeof config[project][column] ? lodash_1.uniq(Object.values(config[project][column])) : [config[project][column]]) : [];
const getProjectLabels = (config, project) => lodash_1.uniq(lodash_1.flatMap(Object.keys(config[project]), column => getLabels(config, project, column)));
exports.getRemoveLabels = (currentLabels, project, column, config) => lodash_1.intersection(currentLabels, lodash_1.difference(getProjectLabels(config, project), exports.getAddLabels([], project, column, config)));
exports.getAddLabels = (currentLabels, project, column, config) => lodash_1.difference(getLabels(config, project, column), currentLabels);
