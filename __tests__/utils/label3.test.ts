/* eslint-disable no-magic-numbers */
import {testEnv} from '@technote-space/github-action-test-helper';
import {getRemoveLabels, getAddLabels} from '../../src/utils/label';

const config = {
  'Project\\d': {
    'Column\\d': [
      'test10',
      'test20',
    ],
    test: [
      'test30',
    ],
  },
  project1: {
    column1: [
      'test1',
      'test2',
    ],
    column2: 'test3',
  },
};

describe('getRemoveLabels', () => {
  testEnv();

  it('should get remove labels', () => {
    process.env.INPUT_SEARCH_PROJECT_BY_REGEXP    = 'true';
    process.env.INPUT_SEARCH_PROJECT_REGEXP_FLAGS = 'i';
    expect(getRemoveLabels([], 'project1', 'column1', config)).toEqual([]);
    expect(getRemoveLabels(['test1', 'test2', 'test3'], 'project1', 'column1', config)).toEqual([
      'test3',
    ]);
  });
});

describe('getAddLabels', () => {
  testEnv();

  it('should get add labels', () => {
    process.env.INPUT_SEARCH_PROJECT_BY_REGEXP    = 'true';
    process.env.INPUT_SEARCH_PROJECT_REGEXP_FLAGS = 'i';
    process.env.INPUT_SEARCH_COLUMN_BY_REGEXP     = 'true';
    process.env.INPUT_SEARCH_COLUMN_REGEXP_FLAGS  = 'i';
    expect(getAddLabels([], 'project1', 'column1', config)).toEqual([
      'test1',
      'test2',
    ]);
    expect(getAddLabels(['test1'], 'project1', 'column1', config)).toEqual([
      'test2',
    ]);
  });
});
