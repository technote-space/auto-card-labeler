/* eslint-disable no-magic-numbers */
import nock from 'nock';
import path from 'path';
import {getRelatedInfo, getLabels, removeLabels, addLabels} from '../../src/utils/issue';
import {disableNetConnect, getApiFixture, getContext, getOctokit} from '@technote-space/github-action-test-helper';

const octokit = getOctokit();

describe('getRelatedInfo', () => {
  disableNetConnect(nock);

  it('should get related info', async() => {
    nock('https://api.github.com')
      .get('/projects/columns/cards/1')
      .reply(200, getApiFixture(path.resolve(__dirname, '..', 'fixtures'), 'projects.columns.cards'));

    expect(await getRelatedInfo({'project_card': {id: 1}}, octokit)).toEqual({
      projectId: 120,
      issueNumber: 123,
    });
  });

  it('should not get related info 1', async() => {
    nock('https://api.github.com')
      .get('/projects/columns/cards/1')
      .reply(200, getApiFixture(path.resolve(__dirname, '..', 'fixtures'), 'projects.columns.cards.error1'));

    expect(await getRelatedInfo({'project_card': {id: 1}}, octokit)).toBe(false);
  });

  it('should not get related info 2', async() => {
    nock('https://api.github.com')
      .get('/projects/columns/cards/1')
      .reply(404);

    expect(await getRelatedInfo({'project_card': {id: 1}}, octokit)).toBe(false);
  });

  it('should throw project error', async() => {
    nock('https://api.github.com')
      .get('/projects/columns/cards/1')
      .reply(200, getApiFixture(path.resolve(__dirname, '..', 'fixtures'), 'projects.columns.cards.error2'));

    const fn = jest.fn();
    try {
      await getRelatedInfo({'project_card': {id: 1}}, octokit);
    } catch (error) {
      fn();
      expect(error).toHaveProperty('message');
      expect(error.message).toBe('Failed to get project number');
    }
    expect(fn).toBeCalled();
  });

  it('should throw issue error', async() => {
    nock('https://api.github.com')
      .get('/projects/columns/cards/1')
      .reply(200, getApiFixture(path.resolve(__dirname, '..', 'fixtures'), 'projects.columns.cards.error3'));

    const fn = jest.fn();
    try {
      await getRelatedInfo({'project_card': {id: 1}}, octokit);
    } catch (error) {
      fn();
      expect(error).toHaveProperty('message');
      expect(error.message).toBe('Failed to get issue number');
    }
    expect(fn).toBeCalled();
  });
});

describe('getLabels', () => {
  disableNetConnect(nock);

  it('should get labels', async() => {
    nock('https://api.github.com')
      .get('/repos/Codertocat/Hello-World/issues/1/labels')
      .reply(200, getApiFixture(path.resolve(__dirname, '..', 'fixtures'), 'repos.issues.labels'));

    expect(await getLabels(1, octokit, getContext({
      repo: {
        owner: 'Codertocat',
        repo: 'Hello-World',
      },
    }))).toEqual(['bug', 'enhancement']);
  });
});

describe('removeLabels', () => {
  disableNetConnect(nock);

  it('should remove labels', async() => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    nock('https://api.github.com')
      .delete('/repos/Codertocat/Hello-World/issues/1/labels/remove1')
      .reply(200, (uri, body) => {
        fn1();
        return body;
      })
      .delete('/repos/Codertocat/Hello-World/issues/1/labels/remove2')
      .reply(200, (uri, body) => {
        fn2();
        return body;
      });

    await removeLabels(1, [
      'remove1',
      'remove2',
    ], octokit, getContext({
      repo: {
        owner: 'Codertocat',
        repo: 'Hello-World',
      },
    }));

    expect(fn1).toBeCalledTimes(1);
    expect(fn2).toBeCalledTimes(1);
  });
});

describe('addLabels', () => {
  disableNetConnect(nock);

  it('should add labels', async() => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    nock('https://api.github.com')
      .post('/repos/Codertocat/Hello-World/issues/1/labels', body => {
        fn1();
        expect(body).toMatchObject({
          labels: ['add1', 'add2'],
        });
        return body;
      })
      .reply(200, (uri, body) => {
        fn2();
        return body;
      });

    await addLabels(1, [
      'add1',
      'add2',
    ], octokit, getContext({
      repo: {
        owner: 'Codertocat',
        repo: 'Hello-World',
      },
    }));

    expect(fn1).toBeCalledTimes(1);
    expect(fn2).toBeCalledTimes(1);
  });
});
