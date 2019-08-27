"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatedIssue = (payload, octokit) => __awaiter(this, void 0, void 0, function* () {
    const cardId = payload['project_card'].id;
    const { data: { content_url: contentUrl } } = yield octokit.projects.getCard({ card_id: cardId });
    const match = contentUrl.match(/issues\/(\d+)$/);
    if (!match) {
        throw new Error('Failed to get issue number');
    }
    return parseInt(match[1]);
});
exports.addLabels = (issue, labels, octokit, context) => __awaiter(this, void 0, void 0, function* () {
    yield octokit.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue,
        labels,
    });
});
exports.removeLabels = (issue, labels, octokit, context) => __awaiter(this, void 0, void 0, function* () {
    yield Promise.all(labels.map(label => octokit.issues.removeLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue,
        name: label,
    })));
});
