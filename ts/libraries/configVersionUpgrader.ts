import { resolve } from 'path';
import fs from 'fs-extra';
import logger from './logger';

import { Config } from '../interfaces/config';

// const wait = (ms: number) => {
// 	return new Promise(res => {
// 		setTimeout(res, ms);
// 	});
// };

const upgrade: (
	//Type Def
	config: Config,
	oldVerson: any,
	newVersion: { version: any }
) => Promise<Config> = async (
	// Arguments
	config: Config,
	oldVerson: any,
	newVersion: { version: any }
) => {
	// Function Content
	if (oldVerson == newVersion) {
		// do housekeeping instead of normal upgrade
		for (const k in config.data) {
			if (Object.hasOwnProperty.call(config.data, k)) {
				let el = config.data[k];

				if (!resolve(el.path) || !fs.existsSync(resolve(el.path))) {
					logger.info(
						`Removed key ${el.label} from data as it no longer exists (${el.path} not found)`
					);
					el = undefined;
				}

				config.data[k] = el;
			}
		}
	} else {
		config.version = newVersion.version;
		config.hasLaunched = true; // if upgrading, assume you already ran it once
		//await wait(500); // just to emulate time consuming shit - will be removed pre-1.0.0
	}
	return config;
};
export default upgrade;
