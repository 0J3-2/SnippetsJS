import ts from 'typescript';

const source = `let x: string  = 'string'`;

let result = ts.transpileModule(source, {
	compilerOptions: {
		module: ts.ModuleKind.CommonJS,
		target: ts.ScriptTarget.Latest,
		sourceMap: true,
		removeComments: true,
		inlineSourceMap: true,
	},
});

console.log(JSON.stringify(result));

export default {};
