import signale from 'signale';
import {GitHub} from '@actions/github/lib/github';
import {Context} from '@actions/github/lib/context';

export const getRelatedIssue: Function = async (payload: object, octokit: GitHub) => {
    signale.info('Getting related issue');

    const cardId = payload['project_card'].id;
    const {data: {content_url: contentUrl}} = await octokit.projects.getCard({card_id: cardId});
    const match = contentUrl.match(/issues\/(\d+)$/);
    if (!match) {
        throw new Error('Failed to get issue number');
    }
    return parseInt(match[1]);
};

export const addLabels: Function = async (issue: number, labels: string[], octokit: GitHub, context: Context) => {
    signale.info('Adding labels');

    await octokit.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue,
        labels,
    });
};

export const removeLabels: Function = async (issue: number, labels: string[], octokit: GitHub, context: Context) => {
    signale.info('Removing labels');

    await Promise.all(labels.map(label => octokit.issues.removeLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue,
        name: label,
    })));
};
