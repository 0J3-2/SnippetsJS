import fs from 'fs-extra';
import yml from 'node-yaml';
import prompts from 'prompts';
import yargs from 'yargs';
import kleur from 'kleur';
import loadConfig, { dataPath } from '../libraries/configLoader';
import checkIntegrity from '../libraries/configIntegrityCheck';
import loader from '../libraries/loader';
import { success, warning, fatal, info } from '../libraries/logger';
import { hideBin } from 'yargs/helpers';
import { resolve } from 'path';
import add from './add';
import { Config } from '../interfaces/config';

const labels = {
	action: 'Which Snippet would you like to run?',
};
(async () => {
	const config: ReturnType<any> = await loadConfig();
	success(
		`Welcome ${config.hasLaunched ? 'Back ' : ''}to SnippetJS!`,
		`Version: ${config.version}`
	);

	let snippets = [];

	snippets[snippets.length] = {
		title: 'Add a Snippet',
		description: 'Sends you to the add-snippet dialog',
		value: 'ADD_SNIPPET',
	};
	snippets[snippets.length] = {
		title: 'Quit',
		description: 'Exits the program',
		value: 'EXIT',
	};

	const { action } = await prompts([
		{
			type: 'select',
			name: 'action',
			message: labels.action,
			choices: snippets,
		},
	]);

	config.hasLaunched = true;

	yml.writeSync(dataPath, config);

	loader.destroy();
})();
