import ts from 'typescript';

/*
const source = `// this should get removed by tsc
let x: string  = 'string'`;
*/

export default source =>
	ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.Latest,
			sourceMap: true,
			removeComments: true,
			inlineSourceMap: true,
		},
	}).outputText;
