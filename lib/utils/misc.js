"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegexpSearchColumnFlags = exports.isRegexpSearchColumn = exports.getRegexpSearchProjectFlags = exports.isRegexpSearchProject = exports.isProjectConfigRequired = exports.getConfigFilename = exports.getColumnName = exports.getProjectName = void 0;
const core_1 = require("@actions/core");
const github_action_helper_1 = require("@technote-space/github-action-helper");
const getProjectName = (projectId, octokit) => __awaiter(void 0, void 0, void 0, function* () { return (yield octokit.projects.get({ 'project_id': projectId })).data.name; });
exports.getProjectName = getProjectName;
const getColumnName = (columnId, octokit) => __awaiter(void 0, void 0, void 0, function* () { return (yield octokit.projects.getColumn({ 'column_id': columnId })).data.name; });
exports.getColumnName = getColumnName;
const getConfigFilename = () => core_1.getInput('CONFIG_FILENAME', { required: true });
exports.getConfigFilename = getConfigFilename;
const isProjectConfigRequired = () => github_action_helper_1.Utils.getBoolValue(core_1.getInput('PROJECT_CONFIG_IS_REQUIRED'));
exports.isProjectConfigRequired = isProjectConfigRequired;
const isRegexpSearchProject = () => github_action_helper_1.Utils.getBoolValue(core_1.getInput('SEARCH_PROJECT_BY_REGEXP'));
exports.isRegexpSearchProject = isRegexpSearchProject;
const getRegexpSearchProjectFlags = () => core_1.getInput('SEARCH_PROJECT_REGEXP_FLAGS');
exports.getRegexpSearchProjectFlags = getRegexpSearchProjectFlags;
const isRegexpSearchColumn = () => github_action_helper_1.Utils.getBoolValue(core_1.getInput('SEARCH_COLUMN_BY_REGEXP'));
exports.isRegexpSearchColumn = isRegexpSearchColumn;
const getRegexpSearchColumnFlags = () => core_1.getInput('SEARCH_COLUMN_REGEXP_FLAGS');
exports.getRegexpSearchColumnFlags = getRegexpSearchColumnFlags;
