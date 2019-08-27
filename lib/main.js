"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const signale_1 = __importDefault(require("signale"));
const config_1 = require("./utils/config");
const issue_1 = require("./utils/issue");
const label_1 = require("./utils/label");
const misc_1 = require("./utils/misc");
const issue_2 = require("./utils/issue");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            signale_1.default.info(`Event: ${github_1.context.eventName}`);
            signale_1.default.info(`Action: ${github_1.context.action}`);
            if (!misc_1.isTargetEvent(github_1.context)) {
                signale_1.default.info('This is not target event.');
                return;
            }
            const octokit = new github_1.GitHub(core_1.getInput('GITHUB_TOKEN', { required: true }));
            const config = yield config_1.getConfig(misc_1.getConfigFilename(), octokit, github_1.context);
            if (!Object.keys(config).length) {
                signale_1.default.warn('There is no valid config file.');
                signale_1.default.warn(`Please create config file: ${misc_1.getConfigFilename()}`);
                return;
            }
            const project = yield misc_1.getProjectName(github_1.context.payload.project_card.id, octokit);
            const column = yield misc_1.getColumnName(github_1.context.payload.project_card.column_id, octokit);
            signale_1.default.info(`Target project: ${project}`);
            signale_1.default.info(`Target column: ${column}`);
            const labelsToRemove = label_1.getRemoveLabels(project, column, config);
            const labelsToAdd = label_1.getAddLabels(project, column, config);
            const issue = issue_1.getRelatedIssue(github_1.context.payload, octokit);
            if (labelsToRemove.length) {
                yield issue_2.removeLabels(issue, labelsToRemove, octokit, github_1.context);
            }
            if (labelsToAdd.length) {
                yield issue_2.addLabels(issue, labelsToAdd, octokit, github_1.context);
            }
            signale_1.default.success(`Removed: ${labelsToRemove.length}`);
            signale_1.default.success(`Added: ${labelsToAdd.length}`);
        }
        catch (error) {
            core_1.setFailed(error.message);
        }
    });
}
run();
