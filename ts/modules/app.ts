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
	editor:
		'Would you like to enter the command/path to your prefered text editor',
};
const main = async () => {
	console.clear();
	success(`> Main Menu <`);

	const config: ReturnType<any> = await loadConfig();
	success(
		`Welcome ${config.hasLaunched ? 'Back ' : ''}to SnippetJS!`,
		`Version: ${config.version}`
	);

	config.hasLaunched = true;

	yml.writeSync(dataPath, config);

	let snippets = [];

	snippets[snippets.length] = {
		title: 'Add a Snippet',
		description: 'Sends you to the add-snippet dialog',
		value: 'ADD_SNIPPET',
	};
	snippets[snippets.length] = {
		title: 'Remove a Snippet',
		description: 'Sends you to the remove-snippet dialog',
		value: 'DEL_SNIPPET',
	};
	snippets[snippets.length] = {
		title: 'Quit',
		description: 'Exits the program',
		value: 'EXIT',
	};

	const { action, editor } = await prompts([
		{
			type: config.editor ? 'text' : null,
			name: 'editor',
			message: labels.editor,
		},
		{
			type: 'select',
			name: 'action',
			message: labels.action,
			choices: snippets,
		},
	]);

	switch (action) {
		case 'EXIT':
			process.exit(0);
			break;

		case 'ADD_SNIPPET':
			console.clear();
			success(`> Add Snippet <`);
			add(main);
			break;

		case 'DEL_SNIPPET':
			console.clear();
			success(`> Remove Snippet <`);

			break;

		default:
			loader.destroy();
			process.exit(0);
			break;
	}
};
main();
