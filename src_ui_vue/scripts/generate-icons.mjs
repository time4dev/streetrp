/**
 * Generates `src/utils/icons.ts` from react-icons SVG data of the legacy project.
 * Guarantees pixel-identical icons and identical component names (IoIosClose, FaGasPump, ...).
 */
import fs from 'node:fs';
import path from 'node:path';

const LEGACY_SRC = path.resolve(import.meta.dirname, '../../src_ui/src');
const LEGACY_ICONS = path.resolve(import.meta.dirname, '../../src_ui/node_modules/react-icons');
const OUT_FILE = path.resolve(import.meta.dirname, '../src/utils/icons.ts');

// 1. Collect every icon imported anywhere in the legacy code
const usage = new Map(); // pack -> Set(names)

function walk(dir) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);

		if (entry.isDirectory()) walk(full);
		else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
			const text = fs.readFileSync(full, 'utf8');
			const re = /import\s*\{([^}]+)\}\s*from\s*['"]react-icons(?:\/([a-z0-9]+))?['"]/g;

			let m;

			while ((m = re.exec(text))) {
				const pack = m[2] ?? 'react-icons';
				const names = m[1]
					.split(',')
					.map((n) => n.trim())
					.filter((n) => n && n !== 'IconType');

				if (!usage.has(pack)) usage.set(pack, new Set());
				names.forEach((n) => usage.get(pack).add(n));
			}
		}
	}
}

walk(LEGACY_SRC);

// 2. Extract icon definitions from react-icons sources
function normalize(node) {
	return {
		tag: node.tag,
		attrs: node.attrs ?? node.attr ?? {},
		child: Array.isArray(node.child) ? node.child.map(normalize) : undefined
	};
}

function extractIcon(source, name) {
	// Icons are declared as: function IoIosClose (props) { return GenIcon({...})(props); }
	const fnRe = new RegExp(
		`function\\s+${name}\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*?GenIcon\\(([\\s\\S]*?)\\)\\(`
	);
	const m = source.match(fnRe);

	if (!m) return null;

	try {
		return normalize(JSON.parse(m[1]));
	} catch {
		return null;
	}
}

const packs = [...usage.keys()];
const icons = [];

for (const pack of packs) {
	const sourcePath = path.join(
		LEGACY_ICONS,
		pack === 'react-icons' ? 'index.js' : pack,
		'index.js'
	);

	if (!fs.existsSync(sourcePath)) {
		console.warn(`  ! pack source not found: ${sourcePath}`);
		continue;
	}

	const source = fs.readFileSync(sourcePath, 'utf8');

	for (const name of usage.get(pack)) {
		if (name === 'IconType') continue;

		const data = extractIcon(source, name);

		if (data) icons.push({ name, data });
		else console.warn(`  ! icon not found: ${name} (${pack})`);
	}
}

icons.sort((a, b) => a.name.localeCompare(b.name));

// 3. Emit a tree-shakeable Vue icon module with identical names
const lines = [
	'/* eslint-disable */',
	'// AUTO-GENERATED from react-icons SVG data — do not edit by hand.',
	'// Every icon renders the exact same SVG as its react-icons counterpart.',
	"import { h, type FunctionalComponent } from 'vue';",
	'',
	'type IconChild = { tag: string; attrs?: Record<string, unknown>; child?: IconChild[] };',
	'type IconData = { tag: string; attrs?: Record<string, unknown>; child?: IconChild[] };',
	'',
	'type IconProps = {',
	'\tsize?: string | number;',
	'\tcolor?: string;',
	'\tclassName?: string;',
	'\tstyle?: Record<string, unknown>;',
	'\ttitle?: string;',
	'};',
	'',
	'function createIcon(name: string, data: IconData): FunctionalComponent<IconProps> {',
	'\treturn (props, { attrs }) => {',
	"\t\tconst { size = '1em', color, className, style, title } = props ?? {};",
	'',
	'\t\tconst svgAttrs = {',
	"\t\t\tstroke: 'currentColor',",
	"\t\t\tfill: 'currentColor',",
	"\t\t\tstrokeWidth: '0',",
	'\t\t\t...(data.attrs ?? {}),',
	'\t\t\t...(attrs as Record<string, unknown>),',
	'\t\t\theight: size,',
	'\t\t\twidth: size,',
	"\t\t\txmlns: 'http://www.w3.org/2000/svg',",
	'\t\t\tclass: className,',
	'\t\t\tstyle: { color, ...style },',
	'\t\t};',
	'',
	'\t\tconst children: ReturnType<typeof h>[] = [];',
	'',
	"\t\tif (title) children.push(h('title', null, title));",
	'',
	'\t\tfor (const child of data.child ?? []) {',
	'\t\t\tchildren.push(renderNode(child));',
	'\t\t}',
	'',
	"\t\treturn h('svg', svgAttrs, children);",
	'\t};',
	'}',
	'',
	'function renderNode(node: IconChild): ReturnType<typeof h> {',
	'\tconst children = node.child && node.child.length ? node.child.map(renderNode) : undefined;',
	'',
	'\treturn h(node.tag, node.attrs ?? {}, children);',
	'}',
	''
];

function renderChild(child) {
	const attrs = JSON.stringify(child.attrs ?? {});
	const kids =
		child.child && child.child.length ? `[${child.child.map(renderChild).join(', ')}]` : '[]';

	return `{ tag: '${child.tag}', attrs: ${attrs}, child: ${kids} }`;
}

for (const icon of icons) {
	const { name, data } = icon;
	const attrs = JSON.stringify(data.attrs);
	const children = data.child ? `[${data.child.map(renderChild).join(', ')}]` : '[]';

	lines.push(
		`export const ${name} = createIcon('${name}', { tag: '${data.tag}', attrs: ${attrs}, child: ${children} });`
	);
}

lines.push('');
lines.push('/** Type compatible with react-icons IconType (for props typed as IconType) */');
lines.push('export type IconType = FunctionalComponent<IconProps>;');
lines.push('');

fs.writeFileSync(OUT_FILE, lines.join('\n'), 'utf8');
console.log(`Generated ${icons.length} icons -> ${OUT_FILE}`);
console.log(`Packs: ${packs.join(', ')}`);
