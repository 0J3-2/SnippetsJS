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

const labels = {
	action: '',
};
(async () => {
	const config = loadConfig();
	console.log(`Welcome`);

	const promptOut = await prompts([
		{
			type: 'select',
			name: 'action',
			message: labels.action,
			choices: [
				{ title: 'JavaScript (Vanilla NodeJS)', value: 'vanilla' },
				{ title: 'TypeScript', value: 'ts' },
			],
		},
	]);
})();
