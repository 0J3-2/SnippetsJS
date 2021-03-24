import checkIntegrity from './configIntegrityCheck';
import upgrade from './configVersionUpgrader';
import loader from './loader';
import { success, fatal } from './logger';
import { Config } from '../interfaces/config';
import { resolve } from 'path';
import semver from 'semver';
import fs from 'fs-extra';
import yml from 'node-yaml';

export const dataPath = resolve('.', 'list.yml');

const Default = async () => {
	loader.setLoaderText('Ensuring Config Exists');
	loader.enableLoader();

	const packageJson = JSON.parse(fs.readFileSync('./package.json'));

	const version = packageJson.version;

	let data: Config = {
		version: version, // last version
		hasLaunched: false, // has launched previously?
		data: {}, // snippets
	};

	const parsedVersion = semver.parse(version);

	if (fs.existsSync(dataPath)) {
		loader.setLoaderText('Found Config! Loading Config...');
		data = yml.readSync(dataPath);

		if (
			!checkIntegrity(data, () => {
				try {
					loader.destroy();
				} catch (error) {}
			})
		)
			return;

		const oldParsedVersion = semver.parse(data.version);

		const compared = parsedVersion.compare(oldParsedVersion);

		if (compared == -1) {
			return fatal(
				'Cannot downgrade version! Please remove your list.yml or upgrade SnippetJS'
			);
		} else if (compared == 1) {
			success('Version Upgrade Detected! Running Config Upgrader...');
			loader.setLoaderText('Upgrading Config...', 'Please be patient...');
			data = await upgrade(data, oldParsedVersion, parsedVersion);
		} else {
			success('Loaded Config!', 'Version Matched - No need to upgrade!');
			data = await upgrade(data, parsedVersion, parsedVersion);
		}
	} else {
		loader.setLoaderText('Config not found. Creating Default Config!');
		yml.writeSync(dataPath, data);
		success('Config Created!');
	}
	loader.disableLoader();
	return data;
};

export default Default;
