import signale from 'signale';
import {GitHub} from '@actions/github/lib/github';
import {Context} from '@actions/github/lib/context';

export const getRelatedInfo = async (payload: object, octokit: GitHub): Promise<{ projectId: number, issueNumber: number } | boolean> => {
    const cardId = payload['project_card'].id;
    signale.info('Getting card related info: %d', cardId);

    const {data} = await octokit.projects.getCard({card_id: cardId});
    if (!('content_url' in data)) {
        return false;
    }

    return {
        projectId: extractProjectNumber(data['project_url']),
        issueNumber: extractIssueNumber(data['content_url']),
    };
};

const extractProjectNumber = (url: string): number => {
    const match = url.match(/projects\/(\d+)$/);
    if (!match) {
        throw new Error('Failed to get project number');
    }
    return parseInt(match[1]);
};

const extractIssueNumber = (url: string): number => {
    const match = url.match(/issues\/(\d+)$/);
    if (!match) {
        throw new Error('Failed to get issue number');
    }
    return parseInt(match[1]);
};

export const addLabels = async (issue: number, labels: string[], octokit: GitHub, context: Context) => {
    signale.info('Adding labels');

    await octokit.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue,
        labels,
    });
};

export const removeLabels = async (issue: number, labels: string[], octokit: GitHub, context: Context) => {
    signale.info('Removing labels');

    await Promise.all(labels.map(label => octokit.issues.removeLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue,
        name: label,
    })));
};
