/* eslint-disable no-magic-numbers */
import nock from 'nock';
import path from 'path';
import { isTargetEvent } from '@technote-space/filter-github-action';
import { testEnv, disableNetConnect, getApiFixture, getContext, getOctokit } from '@technote-space/github-action-test-helper';
import { getProjectName, getColumnName, getConfigFilename } from '../../src/utils/misc';
import { TARGET_EVENTS } from '../../src/constant';

const rootDir = path.resolve(__dirname, '../..');
const octokit = getOctokit();

describe('isTargetEvent', () => {
	it('should return true', () => {
		expect(isTargetEvent(TARGET_EVENTS, getContext({
			payload: {
				action: 'moved',
			},
			eventName: 'project_card',
		}))).toBe(true);
	});

	it('should return false', () => {
		expect(isTargetEvent(TARGET_EVENTS, getContext({
			payload: {
				action: 'moved',
			},
			eventName: 'push',
		}))).toBe(false);
	});

	it('should return false', () => {
		expect(isTargetEvent(TARGET_EVENTS, getContext({
			payload: {
				action: 'created',
			},
			eventName: 'project_card',
		}))).toBe(false);
	});
});

describe('getProjectName', () => {
	disableNetConnect(nock);

	it('should return project name', async() => {
		nock('https://api.github.com')
			.get('/projects/1')
			.reply(200, getApiFixture(path.resolve(__dirname, '..', 'fixtures'), 'projects.get'));

		expect(await getProjectName(1, octokit)).toBe('Backlog');
	});

	it('should not return project name', async() => {
		nock('https://api.github.com')
			.get('/projects/1')
			.reply(404);
		const fn = jest.fn();

		try {
			await getProjectName(1, octokit);
		} catch (error) {
			fn();
			expect(error).toHaveProperty('status');
			expect(error.status).toBe(404);
		}
		expect(fn).toBeCalled();
	});
});

describe('getColumnName', () => {
	disableNetConnect(nock);

	it('should return column name', async() => {
		nock('https://api.github.com')
			.get('/projects/columns/1')
			.reply(200, getApiFixture(path.resolve(__dirname, '..', 'fixtures'), 'projects.columns'));

		expect(await getColumnName(1, octokit)).toBe('To Do');
	});

	it('should not return column name', async() => {
		nock('https://api.github.com')
			.get('/projects/columns/1')
			.reply(404);
		const fn = jest.fn();

		try {
			await getColumnName(1, octokit);
		} catch (error) {
			fn();
			expect(error).toHaveProperty('status');
			expect(error.status).toBe(404);
		}
		expect(fn).toBeCalled();
	});
});

describe('getConfigFilename', () => {
	testEnv(rootDir);

	it('should get config filename', () => {
		process.env.INPUT_CONFIG_FILENAME = 'test';
		expect(getConfigFilename()).toBe('test');
	});

	it('should get default config filename', () => {
		expect(getConfigFilename()).toBe('card-labeler.yml');
	});
});
