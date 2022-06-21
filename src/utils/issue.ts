import type { Context } from '@actions/github/lib/context';
import type { Octokit } from '@technote-space/github-action-helper/dist/types';
import { Utils } from '@technote-space/github-action-helper';

const extractProjectNumber = (url: string): number => {
  const match = url.match(/projects\/(\d+)$/);
  if (!match) {
    throw new Error('Failed to get project number');
  }

  return parseInt(match[1]!, 10);
};

const extractIssueNumber = (url: string): number => {
  const match = url.match(/issues\/(\d+)$/);
  if (!match) {
    throw new Error('Failed to get issue number');
  }

  return parseInt(match[1]!, 10);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRelatedInfo = async(payload: { [key: string]: any }, octokit: Octokit): Promise<{ projectId: number; issueNumber: number } | false> => {
  try {
    const { data } = await octokit.rest.projects.getCard({ 'card_id': payload['project_card'].id });
    if (!('content_url' in data)) {
      return false;
    }

    return {
      projectId: extractProjectNumber(data['project_url']),
      issueNumber: extractIssueNumber(Utils.ensureNotNull(data['content_url'])),
    };
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.log(error);
    // eslint-disable-next-line no-magic-numbers
    if (error.status === 404) {
      return false;
    }

    throw error;
  }
};

export const getLabels = async(issue: number, octokit: Octokit, context: Context): Promise<string[]> => (await octokit.rest.issues.listLabelsOnIssue({
  owner: context.repo.owner,
  repo: context.repo.repo,
  'issue_number': issue,
})).data.map(label => label.name);

export const addLabels = async(issue: number, labels: string[], octokit: Octokit, context: Context): Promise<void> => {
  await octokit.rest.issues.addLabels({
    owner: context.repo.owner,
    repo: context.repo.repo,
    'issue_number': issue,
    labels,
  });
};

export const removeLabels = async(issue: number, labels: string[], octokit: Octokit, context: Context): Promise<void> => {
  await Promise.all(labels.map(label => octokit.rest.issues.removeLabel({
    owner: context.repo.owner,
    repo: context.repo.repo,
    'issue_number': issue,
    name: label,
  })));
};
