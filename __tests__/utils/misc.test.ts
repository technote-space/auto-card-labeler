import nock from 'nock';
import {GitHub} from '@actions/github' ;
import {encodeContent, getApiFixture} from '../util';
import {isTargetEvent, parseConfig, getProjectName, getColumnName, getConfigFilename} from '../../src/utils/misc';
import {DEFAULT_CONFIG_FILENAME} from '../../src/constant';

nock.disableNetConnect();

describe('isTargetEvent', () => {
    it('should return true', () => {
        expect(isTargetEvent({
            payload: {
                action: 'moved',
            },
            eventName: 'project_card',
            sha: '',
            ref: '',
            workflow: '',
            action: '',
            actor: '',
            issue: {
                owner: '',
                repo: '',
                number: 1,
            },
            repo: {
                owner: '',
                repo: '',
            },
        })).toBeTruthy();
    });

    it('should return false', () => {
        expect(isTargetEvent({
            payload: {
                action: 'moved',
            },
            eventName: 'push',
            sha: '',
            ref: '',
            workflow: '',
            action: '',
            actor: '',
            issue: {
                owner: '',
                repo: '',
                number: 1,
            },
            repo: {
                owner: '',
                repo: '',
            },
        })).toBeFalsy();
    });

    it('should return false', () => {
        expect(isTargetEvent({
            payload: {
                action: 'created',
            },
            eventName: 'project_card',
            sha: '',
            ref: '',
            workflow: '',
            action: '',
            actor: '',
            issue: {
                owner: '',
                repo: '',
                number: 1,
            },
            repo: {
                owner: '',
                repo: '',
            },
        })).toBeFalsy();
    });
});

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

describe('getConfigFilename', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = {...OLD_ENV};
        delete process.env.NODE_ENV;
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    it('should get config filename', () => {
        process.env.INPUT_CONFIG_FILENAME = 'test';
        expect(getConfigFilename()).toBe('test');
    });

    it('should get default config filename', () => {
        expect(getConfigFilename()).toBe(DEFAULT_CONFIG_FILENAME);
    });
});
