/**
 * Compiles the legacy Framework7 stylesheets (assets/styles/framework7/index.less)
 * into a plain CSS file consumable by Vite. Resolves `~framework7/...` imports
 * to the framework7 package installed for this purpose.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import less from 'less';

const root = path.resolve(import.meta.dirname, '..');
const entry = path.join(root, 'src/assets/styles/framework7/index.less');
const outFile = path.join(root, 'src/assets/styles/framework7.css');

const lessSource = fs
	.readFileSync(entry, 'utf8')
	.replace(/~framework7\//g, path.join(root, 'node_modules/framework7/').replace(/\\/g, '/'))
	.replace(/url\(\.\/([^)]+)\)/g, (_m, file) => {
		const resolved = path
			.join(root, 'src/assets/styles/framework7/', file)
			.replace(/\\/g, '/');

		return `url(${resolved})`;
	});

less
	.render(lessSource, {
		filename: entry,
		javascriptEnabled: true,
		paths: [path.dirname(entry), path.join(root, 'node_modules')]
	})
	.then((output) => {
		fs.writeFileSync(outFile, output.css, 'utf8');
		console.log(`Compiled framework7 styles -> ${outFile} (${Math.round(output.css.length / 1024)} KB)`);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
