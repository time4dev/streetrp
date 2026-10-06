/**
 * esbuild config for the RAGE:MP client bundle.
 * Replaces the former webpack setup: same entry, same output
 * (../client_packages/index.js), obfuscation in production.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, context } from 'esbuild';
import JavaScriptObfuscator from 'javascript-obfuscator';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

const outfile = path.resolve(__dirname, '../client_packages/index.js');

// Parity with the old CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['index.js'] })
if (fs.existsSync(outfile)) fs.rmSync(outfile);

const options = {
	absWorkingDir: __dirname,
	entryPoints: ['src/index.ts'],
	tsconfig: 'tsconfig.json',
	bundle: true,
	platform: 'node',
	format: 'cjs',
	target: 'es2019',
	outfile,
	charset: 'ascii',
	minify: production,
	sourcemap: false,
	legalComments: 'none',
	logLevel: 'info'
};

function obfuscate() {
	process.stdout.write('obfuscating index.js...\n');
	const code = fs.readFileSync(outfile, 'utf8');
	const result = JavaScriptObfuscator.obfuscate(code, { rotateStringArray: true });
	fs.writeFileSync(outfile, result.getObfuscatedCode());
}

if (watch) {
	const ctx = await context(options);
	await ctx.watch();
} else {
	await build(options);
	if (production) obfuscate();
}
