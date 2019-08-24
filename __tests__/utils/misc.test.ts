import nock from 'nock';
import {GitHub} from '@actions/github' ;
import {encodeContent, getApiFixture} from '../util';
import {parseConfig, getProjectName, getColumnName} from '../../src/utils/misc';

nock.disableNetConnect();

describe('parseConfig', () => {
    it('should parse config', async () => {
        expect(parseConfig(encodeContent(''))).toEqual({});
        expect(parseConfig(encodeContent('a: b'))).toEqual({a: 'b'});
        expect(parseConfig(encodeContent('a:\n  - b\n  - c'))).toEqual({a: ['b', 'c']});
    });
});

describe('getProjectName', () => {
    it('should return project name', async () => {
        nock('https://api.github.com')
            .get('/projects/1')
            .reply(200, getApiFixture('projects.get'));

        expect(await getProjectName(1, new GitHub(''))).toBe('Projects Documentation');
    });

    it('should not return project name', async () => {
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
    it('should return column name', async () => {
        nock('https://api.github.com')
            .get('/projects/columns/1')
            .reply(200, getApiFixture('projects.columns'));

        expect(await getColumnName(1, new GitHub(''))).toBe('To Do');
    });

    it('should not return column name', async () => {
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
