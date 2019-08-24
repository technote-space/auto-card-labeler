import {setFailed, debug, getInput} from '@actions/core' ;
import {context, GitHub} from '@actions/github' ;
import {getConfig} from './utils/config';
import {getRelatedIssue} from './utils/issue';
import {getAddLabels, getRemoveLabels} from './utils/label';
import {getProjectName, getColumnName} from './utils/misc';
import {addLabels, removeLabels} from './utils/issue';
import {CONFIG_FILENAME} from './constant';

async function run() {
    try {
        const owner = context.repo.owner;
        const repo = context.repo.repo;
        const octokit = new GitHub(getInput('GITHUB_TOKEN'));
        const config = await getConfig(owner, repo, CONFIG_FILENAME, octokit);
        if (!Object.keys(config).length) {
            debug(`There is no valid config file [${CONFIG_FILENAME}]`);
            return;
        }

        const project = await getProjectName(context.payload.project_card.id, octokit);
        const column = await getColumnName(context.payload.project_card.column_id, octokit);
        const labelsToRemove = getRemoveLabels(project, column, config);
        const labelsToAdd = getAddLabels(project, column, config);
        const issue = getRelatedIssue(context.payload, octokit);
        if (labelsToRemove.length) {
            await removeLabels(owner, repo, issue, labelsToRemove, octokit);
        }
        if (labelsToAdd.length) {
            await addLabels(owner, repo, issue, labelsToAdd, octokit);
        }
    } catch (error) {
        setFailed(error.message);
    }
}

run();
