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

const argv = yargs(hideBin(process.argv)).option('r', {
	alias: 'runAdd',
	describe: 'Run add.js normally instead of as a module',
	type: 'boolean',
}).argv;

const _mod = () => {
	const labels = {
		SnippetName: /*chalk.rgb(255, 0, 255)*/ `What's your Snippet's Name? `,
		library: `Which JavaScript Parser would you like to use? `,
	};

	process.title = 'SnippetsJS > Add';

	(async () => {
		const data: ReturnType<any> = await loadConfig(); // weird workaround to "data is not a valid propriety of <Timeout | {data contents here}>"

		success('Target Reached: Config Loaded!');

		let cancelled = false;
		let { SnippetName, lib } = await prompts(
			[
				{
					type: 'text',
					name: 'SnippetName',
					message: labels.SnippetName,
					validate: value => {
						let a = value && value != '';
						return a;
					},
				},
				{
					type: prev => (data.data[prev] ? 'toggle' : null),
					name: 'overwrite',
					message: prev => `Overwrite ${prev}?`,
					initial: true,
					active: 'no',
					inactive: 'yes',
				},
				{
					type: 'select',
					name: 'lib',
					message: labels.library,
					choices: [
						{ title: 'JavaScript (Vanilla NodeJS)', value: 'vanilla' },
						{ title: 'TypeScript', value: 'ts' },
					],
				},
			],
			{
				onCancel: () => {
					fatal('Cancelled Prompt');
					cancelled = true;
					return false;
				},
				onSubmit: (prompt, answer) => {
					if (prompt.name == 'overwrite' && answer == true) {
						cancelled = true;
						fatal('User Cancelled');
						return true;
					}
					return false;
				},
			}
		);
		if (cancelled) {
			return;
		}
		if (!SnippetName) {
			return fatal('Snippet Name Missing!');
		}
		if (!lib) {
			return fatal('No Library Selected!');
		}

		const label = `${SnippetName} (${lib})`;
		info(
			`Snippet Information:\n${kleur
				.reset()
				.blue(`NAME:`)} ${kleur
				.reset()
				.italic(SnippetName)}\n${kleur
				.reset()
				.blue(`PARSER:`)} ${kleur.reset().italic(lib)}\n${kleur
				.reset()
				.blue(`LABEL:`)} ${kleur.reset().italic(label)}`
		);

		success('Target Reached: User Input Recieved!');
		loader.setLoaderText('Adding Entry to Config...');
		const filePath = resolve(
			'scripts',
			lib,
			`${SnippetName}.${
				lib == 'vanilla' ? 'js' : lib == 'ts' ? 'ts' : 'unknown'
			}`
		);
		fs.ensureFileSync(filePath);
		data.data[SnippetName] = {
			path: filePath,
			label,
			parser: lib,
		};
		success(`Added Entry`);

		loader.setLoaderText('Writing to Config...');
		yml.writeSync(dataPath, data);

		success(`Wrote to file!`);
		loader.setLoaderText('Ensuring Integrety of Config...');
		if (
			!checkIntegrity(yml.readSync(dataPath), () => {
				try {
					loader.destroy();
				} catch (error) {}
			})
		)
			return;

		loader.destroy();
		success('Target Reached: Finish!');
	})();
};

if (argv.r == true) {
	warning('Flag -r/--runAdd/--run-add specified, not running as module');
	_mod();
}

export default () => {
	if (argv.r) {
		return fatal(
			'Cannot use DEFAULT with -r/--runAdd/--run-add specified. Please run modules/add directly or remove the previously stated argument.'
		);
	}

	return _mod();
};
