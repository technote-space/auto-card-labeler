/* eslint-disable no-magic-numbers */
import path from 'path';
import nock from 'nock';
import { Logger } from '@technote-space/github-action-helper';
import { GitHub } from '@actions/github/lib/github';
import {
	testEnv,
	generateContext,
	disableNetConnect,
	spyOnStdout,
	stdoutCalledWith,
	getConfigFixture,
	getApiFixture,
} from '@technote-space/github-action-test-helper';
import { execute } from '../src/process';

const logger = new Logger();
const octokit = new GitHub('test-token');
const context = generateContext({
	event: 'project_card',
	action: 'moved',
	ref: 'heads/master',
	sha: 'test-sha',
	owner: 'hello',
	repo: 'world',
}, {
	payload: {
		'project_card': {
			id: 1,
			'column_id': 1,
		},
	},
});

describe('execute', () => {
	testEnv();
	disableNetConnect(nock);

	it('should return false 1', async() => {
		process.env.INPUT_CONFIG_FILENAME = 'config.yml';
		const mockStdout = spyOnStdout();
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.github/config.yml')
			.reply(404);

		expect(await execute(logger, octokit, context)).toBe(false);

		stdoutCalledWith(mockStdout, [
			'::warning::There is no valid config file.',
			'::warning::Please create config file: config.yml',
		]);
	});

	it('should return false 2', async() => {
		process.env.INPUT_CONFIG_FILENAME = 'config.yml';
		const mockStdout = spyOnStdout();
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.github/config.yml')
			.reply(200, getConfigFixture(path.resolve(__dirname, 'fixtures'), 'empty.yml'));

		expect(await execute(logger, octokit, context)).toBe(false);

		stdoutCalledWith(mockStdout, [
			'::warning::There is no valid config file.',
			'::warning::Please create config file: config.yml',
		]);
	});

	it('should return false 3', async() => {
		process.env.INPUT_CONFIG_FILENAME = 'config.yml';
		const mockStdout = spyOnStdout();
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.github/config.yml')
			.reply(200, getConfigFixture(path.resolve(__dirname, 'fixtures'), 'config.yml'))
			.get('/projects/columns/cards/1')
			.reply(200, getApiFixture(path.resolve(__dirname, 'fixtures'), 'projects.columns.cards.error1'));

		expect(await execute(logger, octokit, context)).toBe(false);

		stdoutCalledWith(mockStdout, [
			'::group::Getting card related info...',
			'::endgroup::',
			'::warning::There is not related card with this issue.',
		]);
	});

	it('should remove labels', async() => {
		process.env.INPUT_CONFIG_FILENAME = 'config.yml';
		const mockStdout = spyOnStdout();
		const fn1 = jest.fn();
		const fn2 = jest.fn();
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.github/config.yml')
			.reply(200, getConfigFixture(path.resolve(__dirname, 'fixtures', 'remove'), 'config.yml'))
			.get('/projects/columns/cards/1')
			.reply(200, getApiFixture(path.resolve(__dirname, 'fixtures', 'remove'), 'projects.columns.cards'))
			.get('/projects/1')
			.reply(200, getApiFixture(path.resolve(__dirname, 'fixtures'), 'projects.get'))
			.get('/projects/columns/1')
			.reply(200, getApiFixture(path.resolve(__dirname, 'fixtures'), 'projects.columns'))
			.get('/repos/hello/world/issues/1/labels')
			.reply(200, getApiFixture(path.resolve(__dirname, 'fixtures', 'remove'), 'repos.issues.labels'))
			.delete('/repos/hello/world/issues/1/labels/remove1')
			.reply(200, (uri, body) => {
				fn1();
				return body;
			})
			.delete('/repos/hello/world/issues/1/labels/remove2')
			.reply(200, (uri, body) => {
				fn2();
				return body;
			});

		expect(await execute(logger, octokit, context)).toBe(true);

		expect(fn1).toBeCalledTimes(1);
		expect(fn2).toBeCalledTimes(1);
		stdoutCalledWith(mockStdout, [
			'::group::Getting card related info...',
			'> Getting project name... 1',
			'  >> Backlog',
			'> Getting column name... 1',
			'  >> To Do',
			'::endgroup::',
			'::group::Getting current labels...',
			'::endgroup::',
			'::group::Removing labels...',
			'  >> remove1',
			'  >> remove2',
			'::endgroup::',
			'> Removed count: 2',
			'> Added count: 0',
		]);
	});

	it('should add labels', async() => {
		process.env.INPUT_CONFIG_FILENAME = 'config.yml';
		const mockStdout = spyOnStdout();
		const fn = jest.fn();
		nock('https://api.github.com')
			.get('/repos/hello/world/contents/.github/config.yml')
			.reply(200, getConfigFixture(path.resolve(__dirname, 'fixtures', 'add'), 'config.yml'))
			.get('/projects/columns/cards/1')
			.reply(200, getApiFixture(path.resolve(__dirname, 'fixtures', 'add'), 'projects.columns.cards'))
			.get('/projects/1')
			.reply(200, getApiFixture(path.resolve(__dirname, 'fixtures'), 'projects.get'))
			.get('/projects/columns/1')
			.reply(200, getApiFixture(path.resolve(__dirname, 'fixtures'), 'projects.columns'))
			.get('/repos/hello/world/issues/1/labels')
			.reply(200, getApiFixture(path.resolve(__dirname, 'fixtures', 'add'), 'repos.issues.labels'))
			.post('/repos/hello/world/issues/1/labels')
			.reply(200, (uri, body) => {
				fn();
				expect(body).toEqual({
					labels: ['add1', 'add2'],
				});
				return body;
			});

		expect(await execute(logger, octokit, context)).toBe(true);

		expect(fn).toBeCalledTimes(1);
		stdoutCalledWith(mockStdout, [
			'::group::Getting card related info...',
			'> Getting project name... 1',
			'  >> Backlog',
			'> Getting column name... 1',
			'  >> To Do',
			'::endgroup::',
			'::group::Getting current labels...',
			'::endgroup::',
			'::group::Adding labels...',
			'  >> add1',
			'  >> add2',
			'::endgroup::',
			'> Removed count: 0',
			'> Added count: 2',
		]);
	});
});
