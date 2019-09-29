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
const github_action_config_helper_1 = require("@technote-space/github-action-config-helper");
const issue_1 = require("./utils/issue");
const label_1 = require("./utils/label");
const misc_1 = require("./utils/misc");
exports.execute = (logger, octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    const config = yield github_action_config_helper_1.getConfig(misc_1.getConfigFilename(), octokit, context);
    if (false === config || !Object.keys(config).length) {
        logger.warn('There is no valid config file.');
        logger.warn('Please create config file: %s', misc_1.getConfigFilename());
        return false;
    }
    logger.startProcess('Getting card related info...');
    const info = yield issue_1.getRelatedInfo(context.payload, octokit);
    if (false === info) {
        logger.endProcess();
        logger.warn('There is not related card with this issue.');
        return false;
    }
    const { projectId, issueNumber } = info;
    logger.info('Getting project name... %d', projectId);
    const project = yield misc_1.getProjectName(projectId, octokit);
    logger.displayStdout(project);
    logger.info('Getting column name... %d', context.payload.project_card.column_id);
    const column = yield misc_1.getColumnName(context.payload.project_card.column_id, octokit);
    logger.displayStdout(column);
    logger.startProcess('Getting current labels...');
    const currentLabels = yield issue_1.getLabels(issueNumber, octokit, context);
    const labelsToRemove = label_1.getRemoveLabels(currentLabels, project, column, config);
    const labelsToAdd = label_1.getAddLabels(currentLabels, project, column, config);
    if (labelsToRemove.length) {
        logger.startProcess('Removing labels...');
        logger.displayStdout(labelsToRemove);
        yield issue_1.removeLabels(issueNumber, labelsToRemove, octokit, context);
    }
    if (labelsToAdd.length) {
        logger.startProcess('Adding labels...');
        logger.displayStdout(labelsToAdd);
        yield issue_1.addLabels(issueNumber, labelsToAdd, octokit, context);
    }
    logger.endProcess();
    logger.info('Removed count: %d', labelsToRemove.length);
    logger.info('Added count: %d', labelsToAdd.length);
    return true;
});
