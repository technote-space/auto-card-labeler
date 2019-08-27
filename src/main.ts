import {setFailed, getInput} from '@actions/core' ;
import {context, GitHub} from '@actions/github' ;
import signale from 'signale';
import {getConfig} from './utils/config';
import {getRelatedIssue} from './utils/issue';
import {getAddLabels, getRemoveLabels} from './utils/label';
import {isTargetEvent, getProjectName, getColumnName} from './utils/misc';
import {addLabels, removeLabels} from './utils/issue';
import {CONFIG_FILENAME} from './constant';

async function run() {
    try {
        signale.info(`Event: ${context.eventName}`);
        signale.info(`Action: ${context.action}`);
        if (!isTargetEvent(context)) {
            signale.info('This is not target event.');
            return;
        }

        if (typeof process.env.GITHUB_TOKEN === 'undefined' || process.env.GITHUB_TOKEN === '') {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error(`Input required and not supplied: GITHUB_TOKEN`);
        }

        const octokit = new GitHub(process.env.GITHUB_TOKEN);
        const config = await getConfig(CONFIG_FILENAME, octokit, context);
        if (!Object.keys(config).length) {
            signale.warn('There is no valid config file.');
            signale.warn(`Please create config file: ${CONFIG_FILENAME}`);
            return;
        }

        const project = await getProjectName(context.payload.project_card.id, octokit);
        const column = await getColumnName(context.payload.project_card.column_id, octokit);
        const labelsToRemove = getRemoveLabels(project, column, config);
        const labelsToAdd = getAddLabels(project, column, config);
        const issue = getRelatedIssue(context.payload, octokit);
        if (labelsToRemove.length) {
            await removeLabels(issue, labelsToRemove, octokit, context);
        }
        if (labelsToAdd.length) {
            await addLabels(issue, labelsToAdd, octokit, context);
        }

        signale.success(`Removed: ${labelsToRemove.length}`);
        signale.success(`Added: ${labelsToAdd.length}`);
    } catch (error) {
        setFailed(error.message);
    }
}

run();
