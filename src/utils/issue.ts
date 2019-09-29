import { GitHub } from '@actions/github/lib/github';
import { Context } from '@actions/github/lib/context';

const extractProjectNumber = (url: string): number => {
	const match = url.match(/projects\/(\d+)$/);
	if (!match) {
		throw new Error('Failed to get project number');
	}
	return parseInt(match[1], 10);
};

const extractIssueNumber = (url: string): number => {
	const match = url.match(/issues\/(\d+)$/);
	if (!match) {
		throw new Error('Failed to get issue number');
	}
	return parseInt(match[1], 10);
};

export const getRelatedInfo = async(payload: object, octokit: GitHub): Promise<{ projectId: number; issueNumber: number } | false> => {
	const {data} = await octokit.projects.getCard({'card_id': payload['project_card'].id});
	if (!('content_url' in data)) {
		return false;
	}

	return {
		projectId: extractProjectNumber(data['project_url']),
		issueNumber: extractIssueNumber(data['content_url']),
	};
};

export const getLabels = async(issue: number, octokit: GitHub, context: Context): Promise<string[]> => {
	return (await octokit.issues.listLabelsOnIssue({
		owner: context.repo.owner,
		repo: context.repo.repo,
		'issue_number': issue,
	})).data.map(label => label.name);
};

export const addLabels = async(issue: number, labels: string[], octokit: GitHub, context: Context): Promise<void> => {
	await octokit.issues.addLabels({
		owner: context.repo.owner,
		repo: context.repo.repo,
		'issue_number': issue,
		labels,
	});
};

export const removeLabels = async(issue: number, labels: string[], octokit: GitHub, context: Context): Promise<void> => {
	await Promise.all(labels.map(label => octokit.issues.removeLabel({
		owner: context.repo.owner,
		repo: context.repo.repo,
		'issue_number': issue,
		name: label,
	})));
};
