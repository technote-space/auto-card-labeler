/* eslint-disable no-magic-numbers */
import nock from 'nock';
import path from 'path';
import { GitHub } from '@actions/github' ;
import { isTargetEvent } from '@technote-space/filter-github-action';
import { disableNetConnect, getApiFixture, getContext } from '@technote-space/github-action-test-helper';
import { getProjectName, getColumnName, getConfigFilename } from '../../src/utils/misc';
import { TARGET_EVENTS, DEFAULT_CONFIG_FILENAME } from '../../src/constant';

describe('isTargetEvent', () => {
	it('should return true', () => {
		expect(isTargetEvent(TARGET_EVENTS, getContext({
			payload: {
				action: 'moved',
			},
			eventName: 'project_card',
		}))).toBeTruthy();
	});

	it('should return false', () => {
		expect(isTargetEvent(TARGET_EVENTS, getContext({
			payload: {
				action: 'moved',
			},
			eventName: 'push',
		}))).toBeFalsy();
	});

	it('should return false', () => {
		expect(isTargetEvent(TARGET_EVENTS, getContext({
			payload: {
				action: 'created',
			},
			eventName: 'project_card',
		}))).toBeFalsy();
	});
});

describe('getProjectName', () => {
	disableNetConnect(nock);

	it('should return project name', async() => {
		nock('https://api.github.com')
			.get('/projects/1')
			.reply(200, getApiFixture(path.resolve(__dirname, '..', 'fixtures'), 'projects.get'));

		expect(await getProjectName(1, new GitHub(''))).toBe('Backlog');
	});

	it('should not return project name', async() => {
		nock('https://api.github.com')
			.get('/projects/1')
			.reply(404);
		const fn = jest.fn();

		try {
			await getProjectName(1, new GitHub(''));
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

		expect(await getColumnName(1, new GitHub(''))).toBe('To Do');
	});

	it('should not return column name', async() => {
		nock('https://api.github.com')
			.get('/projects/columns/1')
			.reply(404);
		const fn = jest.fn();

		try {
			await getColumnName(1, new GitHub(''));
		} catch (error) {
			fn();
			expect(error).toHaveProperty('status');
			expect(error.status).toBe(404);
		}
		expect(fn).toBeCalled();
	});
});

describe('getConfigFilename', () => {
	const OLD_ENV = process.env;

	beforeEach(() => {
		jest.resetModules();
		process.env = {...OLD_ENV};
		delete process.env.NODE_ENV;
	});

	afterEach(() => {
		process.env = OLD_ENV;
	});

	it('should get config filename', () => {
		process.env.INPUT_CONFIG_FILENAME = 'test';
		expect(getConfigFilename()).toBe('test');
	});

	it('should get default config filename', () => {
		expect(getConfigFilename()).toBe(DEFAULT_CONFIG_FILENAME);
	});
});
