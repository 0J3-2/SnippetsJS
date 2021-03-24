// Fatal Error handler
import kleur from 'kleur';
import symbols from './symbols';

const prelog = () => {
	process.stdout.clearLine(1);
	process.stdout.cursorTo(0);
};

const parselog = (msg: { toString: () => string }) => {
	if (!msg) {
		return;
	}
	return msg
		.toString()
		.split('\n')
		.join(`\n${' '.repeat(2)}`);
};

export const fatal = (err: string) => {
	const icon = symbols.error;
	err = parselog(err);
	prelog();
	console.error(
		`${icon} ${kleur.bold(err || 'No Error message')} ${kleur.gray(
			'(Exiting in 1s)'
		)}`
	);
	return setTimeout(() => {
		process.exit(1);
	}, 1000); // keepAlive
};

export const info = (message: string, message2?: string) => {
	const icon = symbols.info;
	message = parselog(message);
	message2 = parselog(message2);
	prelog();
	console.info(
		`${icon} ${kleur.bold(message || 'No Message Specified')}${
			message2 != '' ? ` ${kleur.gray(`(${message2})`)}` : ''
		}`
	);
};

export const warning = (message: string, message2?: string) => {
	const icon = symbols.warn;
	message = parselog(message);
	message2 = parselog(message2);
	prelog();
	console.warn(
		`${icon} ${kleur.bold(message || 'No Message Specified')}${
			message2 != '' ? ` ${kleur.gray(`(${message2})`)}` : ''
		}`
	);
};

export const success = (message: string, message2?: string) => {
	const icon = symbols.success;
	message = parselog(message);
	message2 = parselog(message2);
	prelog();
	console.log(
		`${icon} ${kleur.bold(message || 'No Message Specified')}${
			message2 != '' ? ` ${kleur.gray(`(${message2})`)}` : ''
		}`
	);
};
export default {
	fatal,
	info,
	warning,
	success,
};
