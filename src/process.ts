import { getConfig } from '@technote-space/github-action-config-helper';
import { GitHub } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { Logger } from '@technote-space/github-action-helper';
import { addLabels, getLabels, getRelatedInfo, removeLabels } from './utils/issue';
import { getAddLabels, getRemoveLabels } from './utils/label';
import { getColumnName, getConfigFilename, getProjectName } from './utils/misc';

export const execute = async(logger: Logger, octokit: GitHub, context: Context): Promise<boolean> => {
	const config = await getConfig(getConfigFilename(), octokit, context);
	if (false === config || !Object.keys(config).length) {
		logger.warn('There is no valid config file.');
		logger.warn('Please create config file: %s', getConfigFilename());
		return false;
	}

	logger.startProcess('Getting card related info...');
	const info = await getRelatedInfo(context.payload, octokit);
	if (false === info) {
		logger.endProcess();
		logger.warn('There is not related card with this issue.');
		return false;
	}

	const {projectId, issueNumber} = info;
	logger.info('Getting project name... %d', projectId);
	const project = await getProjectName(projectId, octokit);
	logger.displayStdout(project);

	logger.info('Getting column name... %d', context.payload.project_card.column_id);
	const column = await getColumnName(context.payload.project_card.column_id, octokit);
	logger.displayStdout(column);

	logger.startProcess('Getting current labels...');
	const currentLabels = await getLabels(issueNumber, octokit, context);
	const labelsToRemove = getRemoveLabels(currentLabels, project, column, config);
	const labelsToAdd = getAddLabels(currentLabels, project, column, config);

	if (labelsToRemove.length) {
		logger.startProcess('Removing labels...');
		logger.displayStdout(labelsToRemove);
		await removeLabels(issueNumber, labelsToRemove, octokit, context);
	}
	if (labelsToAdd.length) {
		logger.startProcess('Adding labels...');
		logger.displayStdout(labelsToAdd);
		await addLabels(issueNumber, labelsToAdd, octokit, context);
	}
	logger.endProcess();

	logger.info('Removed count: %d', labelsToRemove.length);
	logger.info('Added count: %d', labelsToAdd.length);
	return true;
};
