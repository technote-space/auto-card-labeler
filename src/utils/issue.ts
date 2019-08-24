import {GitHub} from '@actions/github/lib/github';

export const getRelatedIssue: Function = async (payload: object, octokit: GitHub) => {
    const cardId = payload['project_card'].id;
    const {data: {content_url: contentUrl}} = await octokit.projects.getCard({card_id: cardId});
    const match = contentUrl.match(/issues\/(\d+)$/);
    if (!match) {
        throw new Error('Failed to get issue number');
    }
    return parseInt(match[1]);
};

export const addLabels: Function = async (owner: string, repo: string, issue: number, labels: string[], octokit: GitHub) => {
    await octokit.issues.addLabels({
        owner, repo, issue_number: issue, labels,
    });
};

export const removeLabels: Function = async (owner: string, repo: string, issue: number, labels: string[], octokit: GitHub) => {
    await Promise.all(labels.map(label => octokit.issues.removeLabel({
        owner, repo, issue_number: issue, name: label,
    })));
};
