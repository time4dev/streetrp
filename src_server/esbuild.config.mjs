/**
 * esbuild config for the RAGE:MP server bundle.
 * Replaces the former webpack setup: same entry, same output
 * (../packages/server/index.js).
 *
 * RAGE:MP server embeds an old Node.js (12.x) that predates ?., ?? and
 * ||= — freshly resolved dependencies may ship such syntax. So every
 * pure-JS dependency is bundled and transpiled down to `target: node12`.
 * Only native / optional native modules stay external and are loaded
 * from node_modules at runtime.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, context } from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

const outfile = path.resolve(__dirname, '../packages/server/index.js');
const outdir = path.dirname(outfile);

// RAGE:MP server runs Node.js 12.x. esbuild transpiles syntax, but not APIs —
// freshly resolved dependencies may use ones added in Node 14/16 (they crash
// with "X is not a function"). Small runtime polyfills, prepended to the bundle.
const polyfills = `
if (!Object.hasOwn) {
	Object.hasOwn = function (object, property) {
		return Object.prototype.hasOwnProperty.call(object, property);
	};
}
if (!String.prototype.replaceAll) {
	String.prototype.replaceAll = function (search, replacement) {
		if (search instanceof RegExp) {
			if (!search.global) throw new TypeError('String.prototype.replaceAll called with a non-global RegExp argument');
			return String(this).replace(search, replacement);
		}
		return String(this).split(search).join(replacement);
	};
}
if (!Array.prototype.at) {
	Array.prototype.at = function (index) {
		index = Math.trunc(index) || 0;
		if (index < 0) index += this.length;
		return index >= 0 && index < this.length ? this[index] : undefined;
	};
}
if (!Array.prototype.findLast) {
	Array.prototype.findLast = function (predicate, thisArg) {
		for (var i = this.length - 1; i >= 0; i--) if (predicate.call(thisArg, this[i], i, this)) return this[i];
		return undefined;
	};
}
if (!Array.prototype.findLastIndex) {
	Array.prototype.findLastIndex = function (predicate, thisArg) {
		for (var i = this.length - 1; i >= 0; i--) if (predicate.call(thisArg, this[i], i, this)) return i;
		return -1;
	};
}
`;

// Parity with the old CleanWebpackPlugin (wiped the whole output dir)
if (fs.existsSync(outdir)) fs.rmSync(outdir, { recursive: true, force: true });

// Native bindings cannot be bundled (loaded from node_modules at runtime,
// the mongodb driver wraps them in try/catch). Everything else — including
// pure-JS optional modules like saslprep and aws4 — gets bundled.
const external = [
	'mongodb-client-encryption',
	'kerberos',
	'bson-ext',
	'snappy'
];

const options = {
	absWorkingDir: __dirname,
	entryPoints: ['src/index.ts'],
	tsconfig: 'tsconfig.json',
	bundle: true,
	platform: 'node',
	format: 'cjs',
	target: 'node12',
	outfile,
	external,
	charset: 'ascii',
	minify: production,
	sourcemap: true,
	legalComments: 'none',
	banner: { js: polyfills },
	logLevel: 'info'
};

if (watch) {
	const ctx = await context(options);
	await ctx.watch();
} else {
	await build(options);
}
