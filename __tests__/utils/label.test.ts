import {getRemoveLabels, getAddLabels} from '../../src/utils/label';

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
        expect(getRemoveLabels('project1', 'column1', config)).toEqual([
            'test3',
        ]);
        expect(getRemoveLabels('project1', 'column2', config)).toEqual([
            'test1',
            'test2',
        ]);
        expect(getRemoveLabels('project1', 'column3', config)).toEqual([
            'test1',
            'test2',
            'test3',
        ]);
        expect(getRemoveLabels('project2', 'column1', config)).toEqual([]);
    });
});

describe('getAddLabels', () => {
    it('should get add labels', () => {
        expect(getAddLabels('project1', 'column1', config)).toEqual([
            'test1',
            'test2',
        ]);
        expect(getAddLabels('project1', 'column2', config)).toEqual([
            'test3',
        ]);
        expect(getAddLabels('project1', 'column3', config)).toEqual([]);
        expect(getAddLabels('project2', 'column1', config)).toEqual([
            'test4',
        ]);
    });
});
