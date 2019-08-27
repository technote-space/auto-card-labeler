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
const signale_1 = __importDefault(require("signale"));
exports.getRelatedInfo = (payload, octokit) => __awaiter(this, void 0, void 0, function* () {
    const cardId = payload['project_card'].id;
    signale_1.default.info('Getting card related info: %d', cardId);
    const { data } = yield octokit.projects.getCard({ card_id: cardId });
    if (!('content_url' in data)) {
        return false;
    }
    return {
        projectId: extractProjectNumber(data['project_url']),
        issueNumber: extractIssueNumber(data['content_url']),
    };
});
const extractProjectNumber = (url) => {
    const match = url.match(/projects\/(\d+)$/);
    if (!match) {
        throw new Error('Failed to get project number');
    }
    return parseInt(match[1], 10);
};
const extractIssueNumber = (url) => {
    const match = url.match(/issues\/(\d+)$/);
    if (!match) {
        throw new Error('Failed to get issue number');
    }
    return parseInt(match[1], 10);
};
exports.getLabels = (issue, octokit, context) => __awaiter(this, void 0, void 0, function* () {
    signale_1.default.info('Getting current labels');
    return (yield octokit.issues.listLabelsOnIssue({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue,
    })).data.map(label => label.name);
});
exports.addLabels = (issue, labels, octokit, context) => __awaiter(this, void 0, void 0, function* () {
    signale_1.default.info('Adding labels');
    yield octokit.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue,
        labels,
    });
});
exports.removeLabels = (issue, labels, octokit, context) => __awaiter(this, void 0, void 0, function* () {
    signale_1.default.info('Removing labels');
    yield Promise.all(labels.map(label => octokit.issues.removeLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue,
        name: label,
    })));
});
