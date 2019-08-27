import {setFailed, getInput} from '@actions/core' ;
import {context, GitHub} from '@actions/github' ;
import signale from 'signale';
import {getConfig} from './utils/config';
import {getRelatedIssue} from './utils/issue';
import {getAddLabels, getRemoveLabels} from './utils/label';
import {isTargetEvent, getProjectName, getColumnName, getConfigFilename} from './utils/misc';
import {addLabels, removeLabels} from './utils/issue';

async function run() {
    try {
        signale.info(`Event: ${context.eventName}`);
        signale.info(`Action: ${context.action}`);
        if (!isTargetEvent(context)) {
            signale.info('This is not target event.');
            return;
        }

        const octokit = new GitHub(getInput('GITHUB_TOKEN', {required: true}));
        const config = await getConfig(getConfigFilename(), octokit, context);
        if (!Object.keys(config).length) {
            signale.warn('There is no valid config file.');
            signale.warn(`Please create config file: ${getConfigFilename()}`);
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
