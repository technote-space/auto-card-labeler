import nock from 'nock';
import {GitHub} from '@actions/github' ;
import {getConfig} from '../../src/utils/config';
import {getConfigFixture} from '../util';
import {CONFIG_FILENAME} from '../../src/constant';

describe('getConfig', () => {
    it('should get config', async () => {
        nock('https://api.github.com')
            .get(`/repos/Codertocat/Hello-World/contents/.github/${CONFIG_FILENAME}`)
            .reply(200, getConfigFixture());

        const config = await getConfig(CONFIG_FILENAME, new GitHub(''), {
            repo: {
                owner: 'Codertocat', repo: 'Hello-World',
            },
        });
        expect(config).toHaveProperty('Backlog');
        expect(config['Backlog']).toHaveProperty('test1');
        expect(typeof config['Backlog']['test1']).toBe('object');
        expect(typeof config['Backlog']['test2']).toBe('object');
    });

    it('should not get config', async () => {
        nock('https://api.github.com')
            .get(`/repos/Codertocat/Hello-World/contents/.github/${CONFIG_FILENAME}`)
            .reply(404);

        const fn = jest.fn();
        try {
            await getConfig(CONFIG_FILENAME, new GitHub(''), {
                repo: {
                    owner: 'Codertocat', repo: 'Hello-World',
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
