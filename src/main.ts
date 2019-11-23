import { setFailed, getInput } from '@actions/core' ;
import { context, GitHub } from '@actions/github' ;
import { isTargetEvent } from '@technote-space/filter-github-action';
import { Logger, ContextHelper } from '@technote-space/github-action-helper';
import path from 'path';
import { execute } from './process';
import { TARGET_EVENTS } from './constant';

/**
 * run
 */
async function run(): Promise<void> {
	const logger = new Logger();
	ContextHelper.showActionInfo(path.resolve(__dirname, '..'), logger, context);

	if (!isTargetEvent(TARGET_EVENTS, context)) {
		logger.info('This is not target event.');
		return;
	}

	await execute(logger, new GitHub(getInput('GITHUB_TOKEN', {required: true})), context);
}

run().catch(error => setFailed(error.message));
