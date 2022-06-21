/* eslint-disable no-magic-numbers */
import { describe, expect, it } from 'vitest';
import {testEnv} from '@technote-space/github-action-test-helper';
import {getRemoveLabels, getAddLabels} from '../../src/utils/label';

const config = {
  'Project\\d': {
    'Column\\d': [
      'test1',
      'test2',
    ],
    test: [
      'test3',
    ],
  },
};

describe('getRemoveLabels', () => {
  testEnv();

  it('should get remove labels', () => {
    process.env.INPUT_SEARCH_PROJECT_BY_REGEXP    = 'true';
    process.env.INPUT_SEARCH_PROJECT_REGEXP_FLAGS = 'i';
    expect(getRemoveLabels([], 'project1', 'column1', config)).toEqual([]);
    expect(getRemoveLabels(['test1', 'test2', 'test3'], 'project1', 'column1', config)).toEqual([
      'test1', 'test2', 'test3',
    ]);
  });

  it('should get remove labels', () => {
    process.env.INPUT_SEARCH_PROJECT_BY_REGEXP    = 'true';
    process.env.INPUT_SEARCH_PROJECT_REGEXP_FLAGS = 'i';
    process.env.INPUT_SEARCH_COLUMN_BY_REGEXP     = 'true';
    process.env.INPUT_SEARCH_COLUMN_REGEXP_FLAGS  = 'i';
    expect(getRemoveLabels(['test1', 'test2', 'test3'], 'project1', 'column1', config)).toEqual([
      'test3',
    ]);
  });

  it('should throw error', () => {
    process.env.INPUT_SEARCH_PROJECT_BY_REGEXP = 'true';
    expect(() => getRemoveLabels([], 'project1', 'column1', config)).toThrow('project [project1] is not found.');
  });
});

describe('getAddLabels', () => {
  testEnv();

  it('should get add labels', () => {
    process.env.INPUT_SEARCH_PROJECT_BY_REGEXP    = 'true';
    process.env.INPUT_SEARCH_PROJECT_REGEXP_FLAGS = 'i';
    process.env.INPUT_SEARCH_COLUMN_BY_REGEXP     = 'true';
    expect(getAddLabels([], 'project1', 'column1', config)).toEqual([]);
  });

  it('should get add labels', () => {
    process.env.INPUT_SEARCH_PROJECT_BY_REGEXP    = 'true';
    process.env.INPUT_SEARCH_PROJECT_REGEXP_FLAGS = 'i';
    process.env.INPUT_SEARCH_COLUMN_BY_REGEXP     = 'true';
    process.env.INPUT_SEARCH_COLUMN_REGEXP_FLAGS  = 'i';
    expect(getAddLabels([], 'project1', 'column1', config)).toEqual([
      'test1',
      'test2',
    ]);
  });
});
