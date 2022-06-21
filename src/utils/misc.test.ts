/* eslint-disable no-magic-numbers */
import { describe, expect, it, vi } from 'vitest';
import nock from 'nock';
import path from 'path';
import { isTargetEvent } from '@technote-space/filter-github-action';
import { testEnv, disableNetConnect, getApiFixture, getContext, getOctokit } from '@technote-space/github-action-test-helper';
import { getProjectName, getColumnName, getConfigFilename, findMatched } from './misc';
import { TARGET_EVENTS } from '../constant';

const rootDir = path.resolve(__dirname, '../..');
const octokit = getOctokit();

describe('isTargetEvent', () => {
  it('should return true 1', () => {
    expect(isTargetEvent(TARGET_EVENTS, getContext({
      payload: {
        action: 'moved',
      },
      eventName: 'project_card',
    }))).toBe(true);
  });

  it('should return true 2', () => {
    expect(isTargetEvent(TARGET_EVENTS, getContext({
      payload: {
        action: 'created',
      },
      eventName: 'project_card',
    }))).toBe(true);
  });

  it('should return false 1', () => {
    expect(isTargetEvent(TARGET_EVENTS, getContext({
      payload: {
        action: 'moved',
      },
      eventName: 'push',
    }))).toBe(false);
  });

  it('should return false 2', () => {
    expect(isTargetEvent(TARGET_EVENTS, getContext({
      payload: {
        action: 'edited',
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
    const fn = vi.fn();

    try {
      await getProjectName(1, octokit);
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
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
    const fn = vi.fn();

    try {
      await getColumnName(1, octokit);
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
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

describe('findMatched', () => {
  it('should return matched item', () => {
    expect(findMatched(['a', '.+'], '', 'test1')).toBe('.+');
    expect(findMatched(['a', 'test\\d'], '', 'test1')).toBe('test\\d');
    expect(findMatched(['a', 'Test\\d'], 'i', 'test1')).toBe('Test\\d');
    expect(findMatched(['*', 'Test\\d'], 'i', 'test1')).toBe('Test\\d');
  });

  it('should return undefined', () => {
    expect(findMatched(['a', 'test\\d'], '', 'test')).toBeUndefined();
    expect(findMatched(['a', 'Test\\d'], '', 'test1')).toBeUndefined();
    expect(findMatched(['*', 'Test\\d'], '', 'test1')).toBeUndefined();
  });
});
