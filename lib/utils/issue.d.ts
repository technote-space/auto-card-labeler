import type { Context } from '@actions/github/lib/context';
import type { Octokit } from '@technote-space/github-action-helper/dist/types';
export declare const getRelatedInfo: (payload: {
    [key: string]: any;
}, octokit: Octokit) => Promise<{
    projectId: number;
    issueNumber: number;
} | false>;
export declare const getLabels: (issue: number, octokit: Octokit, context: Context) => Promise<string[]>;
export declare const addLabels: (issue: number, labels: string[], octokit: Octokit, context: Context) => Promise<void>;
export declare const removeLabels: (issue: number, labels: string[], octokit: Octokit, context: Context) => Promise<void>;
