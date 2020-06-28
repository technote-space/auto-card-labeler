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
exports.removeLabels = exports.addLabels = exports.getLabels = exports.getRelatedInfo = void 0;
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.getRelatedInfo = (payload, octokit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield octokit.projects.getCard({ 'card_id': payload['project_card'].id });
        if (!('content_url' in data)) {
            return false;
        }
        return {
            projectId: extractProjectNumber(data['project_url']),
            issueNumber: extractIssueNumber(data['content_url']),
        };
    }
    catch (error) {
        console.log(error);
        // eslint-disable-next-line no-magic-numbers
        if (error.status === 404) {
            return false;
        }
        throw error;
    }
});
exports.getLabels = (issue, octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield octokit.issues.listLabelsOnIssue({
        owner: context.repo.owner,
        repo: context.repo.repo,
        'issue_number': issue,
    })).data.map(label => label.name);
});
exports.addLabels = (issue, labels, octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    yield octokit.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        'issue_number': issue,
        labels,
    });
});
exports.removeLabels = (issue, labels, octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(labels.map(label => octokit.issues.removeLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        'issue_number': issue,
        name: label,
    })));
});
