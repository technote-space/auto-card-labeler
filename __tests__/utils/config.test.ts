import nock from 'nock';
import {GitHub} from '@actions/github' ;
import {getConfig} from '../../src/utils/config';
import {getConfigFixture} from '../util';
import {getConfigFilename} from '../../src/utils/misc';

nock.disableNetConnect();

describe('getConfig', () => {
    it('should get config', async () => {
        nock('https://api.github.com')
            .get(`/repos/Codertocat/Hello-World/contents/.github/${getConfigFilename()}`)
            .reply(200, getConfigFixture());

        const config = await getConfig(getConfigFilename(), new GitHub(''), {
            payload: {
                action: '',
            },
            eventName: '',
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
                owner: 'Codertocat',
                repo: 'Hello-World',
            },
        });
        expect(config).toHaveProperty('Backlog');
        expect(config['Backlog']).toHaveProperty('test1');
        expect(typeof config['Backlog']['test1']).toBe('object');
        expect(typeof config['Backlog']['test2']).toBe('object');
    });

    it('should not get config', async () => {
        nock('https://api.github.com')
            .get(`/repos/Codertocat/Hello-World/contents/.github/${getConfigFilename()}`)
            .reply(404);

        const fn = jest.fn();
        try {
            await getConfig(getConfigFilename(), new GitHub(''), {
                payload: {
                    action: '',
                },
                eventName: '',
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
                    owner: 'Codertocat',
                    repo: 'Hello-World',
                },
            });
        } catch (error) {
            fn();
            expect(error).toHaveProperty('status');
            expect(error.status).toBe(404);
        }
        expect(fn).toBeCalled();
    });
});
