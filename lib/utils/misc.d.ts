import type { Octokit } from '@technote-space/github-action-helper/dist/types';
export declare const getProjectName: (projectId: number, octokit: Octokit) => Promise<string>;
export declare const getColumnName: (columnId: number, octokit: Octokit) => Promise<string>;
export declare const getConfigFilename: () => string;
export declare const isProjectConfigRequired: () => boolean;
export declare const isRegexpSearchProject: () => boolean;
export declare const getRegexpSearchProjectFlags: () => string;
export declare const isRegexpSearchColumn: () => boolean;
export declare const getRegexpSearchColumnFlags: () => string;
export declare const findMatched: (items: string[], flags: string, string: string) => string | undefined;