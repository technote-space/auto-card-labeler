/* eslint-disable no-magic-numbers */
import { getRemoveLabels, getAddLabels } from '../../src/utils/label';

const config = {
	project1: {
		column1: [
			'test1',
			'test2',
		],
		column2: 'test3',
	},
	project2: {
		column1: [
			'test4',
		],
	},
};

describe('getRemoveLabels', () => {
	it('should get remove labels', () => {
		expect(getRemoveLabels([], 'project1', 'column1', config)).toEqual([]);
		expect(getRemoveLabels(['test1', 'test2', 'test3'], 'project1', 'column1', config)).toEqual([
			'test3',
		]);
		expect(getRemoveLabels([], 'project1', 'column2', config)).toEqual([]);
		expect(getRemoveLabels(['test2', 'test3'], 'project1', 'column2', config)).toEqual([
			'test2',
		]);
		expect(getRemoveLabels([], 'project1', 'column3', config)).toEqual([]);
		expect(getRemoveLabels(['test1', 'test3', 'test5'], 'project1', 'column3', config)).toEqual([
			'test1',
			'test3',
		]);
		expect(getRemoveLabels([], 'project2', 'column1', config)).toEqual([]);
		expect(getRemoveLabels(['test1', 'test2', 'test3'], 'project2', 'column1', config)).toEqual([]);
	});

	it('should throw error', () => {
		expect(() => getRemoveLabels([], 'project0', 'column1', config)).toThrow('project [project0] is not found.');
	});
});

describe('getAddLabels', () => {
	it('should get add labels', () => {
		expect(getAddLabels([], 'project1', 'column1', config)).toEqual([
			'test1',
			'test2',
		]);
		expect(getAddLabels(['test1'], 'project1', 'column1', config)).toEqual([
			'test2',
		]);
		expect(getAddLabels(['test1', 'test2', 'test3'], 'project1', 'column1', config)).toEqual([]);
		expect(getAddLabels([], 'project1', 'column2', config)).toEqual([
			'test3',
		]);
		expect(getAddLabels([], 'project1', 'column3', config)).toEqual([]);
		expect(getAddLabels([], 'project2', 'column1', config)).toEqual([
			'test4',
		]);
	});

	it('should throw error', () => {
		expect(() => getAddLabels([], 'project0', 'column1', config)).toThrow('project [project0] is not found.');
	});
});
