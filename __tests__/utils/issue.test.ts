import nock from 'nock';
import {GitHub} from '@actions/github' ;
import {getRelatedIssue, removeLabels, addLabels} from '../../src/utils/issue';
import {getApiFixture} from '../util';

describe('getRelatedIssue', () => {
    it('should get related issue', async () => {
        nock('https://api.github.com')
            .get('/projects/columns/cards/1')
            .reply(200, getApiFixture('projects.columns.cards'));

        expect(await getRelatedIssue({project_card: {id: 1}}, new GitHub(''))).toBe(123);
    });

    it('should not get related issue', async () => {
        nock('https://api.github.com')
            .get('/projects/columns/cards/1')
            .reply(200, getApiFixture('projects.columns.cards.error'));

        const fn = jest.fn();
        try {
            await getRelatedIssue({project_card: {id: 1}}, new GitHub(''));
        } catch (error) {
            fn();
            expect(error).toHaveProperty('message');
            expect(error.message).toBe('Failed to get issue number');
        }
        expect(fn).toBeCalled();
    });

    it('should not get related issue', async () => {
        nock('https://api.github.com')
            .get('/projects/columns/cards/1')
            .reply(404);

        const fn = jest.fn();
        try {
            await getRelatedIssue({project_card: {id: 1}}, new GitHub(''));
        } catch (error) {
            fn();
            expect(error).toHaveProperty('status');
            expect(error.status).toBe(404);
        }
        expect(fn).toBeCalled();
    });
});

describe('removeLabels', () => {
    it('should remove labels', async () => {
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

        await removeLabels('Codertocat', 'Hello-World', 1, [
            'remove1',
            'remove2',
        ], new GitHub(''));

        expect(fn1).toBeCalledTimes(1);
        expect(fn2).toBeCalledTimes(1);
    });
});

describe('addLabels', () => {
    it('should add labels', async () => {
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

        await addLabels('Codertocat', 'Hello-World', 1, [
            'add1',
            'add2',
        ], new GitHub(''));

        expect(fn1).toBeCalledTimes(1);
        expect(fn2).toBeCalledTimes(1);
    });
});
