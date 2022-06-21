/* eslint-disable no-magic-numbers */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import path from 'path';
import nock from 'nock';
import { Logger } from '@technote-space/github-action-log-helper';
import {
  testEnv,
  generateContext,
  disableNetConnect,
  spyOnStdout,
  stdoutCalledWith,
  getConfigFixture,
  getApiFixture,
  getOctokit,
} from '@technote-space/github-action-test-helper';
import { execute } from './process';

const logger  = new Logger();
const octokit = getOctokit();
const context = generateContext({
  event: 'project_card',
  action: 'moved',
  ref: 'refs/heads/master',
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

beforeEach(() => {
  Logger.resetForTesting();
});

describe('execute', () => {
  testEnv();
  disableNetConnect(nock);

  it('should return false 1', async() => {
    process.env.INPUT_CONFIG_FILENAME = 'config.yml';
    const mockStdout                  = spyOnStdout();
    nock('https://api.github.com')
      .get(`/repos/hello/world/contents/${encodeURIComponent('.github/config.yml')}`)
      .reply(404);

    expect(await execute(logger, octokit, context)).toBe(false);

    stdoutCalledWith(mockStdout, [
      '::warning::There is no valid config file.',
      '::warning::Please create config file: config.yml',
    ]);
  });

  it('should return false 2', async() => {
    process.env.INPUT_CONFIG_FILENAME = 'config.yml';
    const mockStdout                  = spyOnStdout();
    nock('https://api.github.com')
      .get(`/repos/hello/world/contents/${encodeURIComponent('.github/config.yml')}`)
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
    const mockStdout                  = spyOnStdout();
    const fn1                         = vi.fn();
    const fn2                         = vi.fn();
    nock('https://api.github.com')
      .get(`/repos/hello/world/contents/${encodeURIComponent('.github/config.yml')}`)
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
    const mockStdout                  = spyOnStdout();
    const fn                          = vi.fn();
    nock('https://api.github.com')
      .get(`/repos/hello/world/contents/${encodeURIComponent('.github/config.yml')}`)
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

  it('should output warning', async() => {
    process.env.INPUT_CONFIG_FILENAME = 'config.yml';
    const mockStdout                  = spyOnStdout();
    nock('https://api.github.com')
      .get(`/repos/hello/world/contents/${encodeURIComponent('.github/config.yml')}`)
      .reply(200, getConfigFixture(path.resolve(__dirname, 'fixtures', 'add'), 'config.yml'))
      .get('/projects/columns/cards/1')
      .reply(200, getApiFixture(path.resolve(__dirname, 'fixtures', 'add'), 'projects.columns.cards'))
      .get('/projects/1')
      .reply(200, getApiFixture(path.resolve(__dirname, 'fixtures'), 'projects.get2'))
      .get('/projects/columns/1')
      .reply(200, getApiFixture(path.resolve(__dirname, 'fixtures'), 'projects.columns'))
      .get('/repos/hello/world/issues/1/labels')
      .reply(200, getApiFixture(path.resolve(__dirname, 'fixtures', 'add'), 'repos.issues.labels'));

    expect(await execute(logger, octokit, context)).toBe(true);

    stdoutCalledWith(mockStdout, [
      '::group::Getting card related info...',
      '> Getting project name... 1',
      '  >> Backlog2',
      '> Getting column name... 1',
      '  >> To Do',
      '::endgroup::',
      '::group::Getting current labels...',
      '::endgroup::',
      '::warning::project [Backlog2] is not found.',
    ]);
  });

  it('should throw error', async() => {
    process.env.INPUT_CONFIG_FILENAME            = 'config.yml';
    process.env.INPUT_PROJECT_CONFIG_IS_REQUIRED = 'true';
    const mockStdout                             = spyOnStdout();
    nock('https://api.github.com')
      .get(`/repos/hello/world/contents/${encodeURIComponent('.github/config.yml')}`)
      .reply(200, getConfigFixture(path.resolve(__dirname, 'fixtures', 'add'), 'config.yml'))
      .get('/projects/columns/cards/1')
      .reply(200, getApiFixture(path.resolve(__dirname, 'fixtures', 'add'), 'projects.columns.cards'))
      .get('/projects/1')
      .reply(200, getApiFixture(path.resolve(__dirname, 'fixtures'), 'projects.get2'))
      .get('/projects/columns/1')
      .reply(200, getApiFixture(path.resolve(__dirname, 'fixtures'), 'projects.columns'))
      .get('/repos/hello/world/issues/1/labels')
      .reply(200, getApiFixture(path.resolve(__dirname, 'fixtures', 'add'), 'repos.issues.labels'));

    await expect(execute(logger, octokit, context)).rejects.toThrow('project [Backlog2] is not found.');

    stdoutCalledWith(mockStdout, [
      '::group::Getting card related info...',
      '> Getting project name... 1',
      '  >> Backlog2',
      '> Getting column name... 1',
      '  >> To Do',
      '::endgroup::',
      '::group::Getting current labels...',
    ]);
  });
});
