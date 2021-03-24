import { fatal } from './logger';

const requiredProprieties = ['version', 'data'];
const requiredDataProprieties = ['path', 'label'];

export default (data, errorCallback) => {
	if (!errorCallback) {
		errorCallback = () => {};
	}
	if (!data) {
		errorCallback();
		return;
	}

	let errored = false;
	requiredProprieties.forEach(prop => {
		if (errored) return false;

		if (!data[prop]) {
			fatal(
				`Corrupted Config Detected! Please delete list.yml and try again. (Config does not have propriety '${prop}')`
			);
			errored = true;
			return;
		}
	});
	if (errored) return errorCallback() && false;

	for (const key in data.data) {
		if (Object.hasOwnProperty.call(data.data, key)) {
			const d = data.data[key];
			requiredDataProprieties.forEach(requiredProp => {
				if (errored == true) return false;

				if (!d) {
					fatal(
						`Corrupted Config Detected! Please delete list.yml and try again. (Empty Key data>${key})`
					);
					errored = true;
					return;
				}

				if (!d[requiredProp]) {
					fatal(
						`Corrupted Config Detected! Please delete list.yml and try again. (Config does not have propriety '${requiredProp}' in data>${key})`
					);
					errored = true;
					return;
				}
			});
		}
	}
	if (errored) return errorCallback() && false;

	return !errored;
};
