/**
 * RPC / event registry for the StreetRP -> FiveM port.
 *
 * Scans the RAGE:MP sources and the Vue UI, extracts every RPC and event name
 * (handler or call site) and writes:
 *   tools/registry/registry.json  - machine-readable list
 *   tools/registry/REGISTRY.md    - checklist for the port
 *
 * Usage: node tools/registry/scan.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

// TypeScript lives in the UI workspace; reuse it instead of adding a root dep.
const requireFromUi = createRequire(path.join(root, 'src_ui_vue/package.json'));
const ts = requireFromUi('typescript');

const TARGETS = [
	{ side: 'server', dir: 'src_server/src', exts: ['.ts'] },
	{ side: 'client', dir: 'src_client/src', exts: ['.ts'] },
	{ side: 'ui', dir: 'src_ui_vue/src', exts: ['.ts', '.vue'] }
];

const CALL_KINDS = new Set([
	'register',
	'callServer',
	'callClient',
	'callRemote',
	'callBrowser',
	'callInStream',
	'call',
	'subscribe',
	'subscribeToDefault',
	'add'
]);

const entries = [];

function walk(dir, exts) {
	const out = [];

	for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
		if (item.name === 'node_modules' || item.name === 'build' || item.name === '.git') continue;

		const full = path.join(dir, item.name);

		if (item.isDirectory()) out.push(...walk(full, exts));
		else if (exts.includes(path.extname(item.name))) out.push(full);
	}

	return out;
}

/** Vue SFC: keep only <script> blocks, preserve line numbers. */
function maskVue(source) {
	let masked = source.replace(/[^\n]/g, ' ');

	for (const match of source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
		const start = match.index + match[0].indexOf('>') + 1;
		const body = match[1];

		masked = masked.slice(0, start) + body + masked.slice(start + body.length);
	}

	return masked;
}

function stringArg(node) {
	if (!node || !ts.isStringLiteralLike(node)) return null;

	return node.text;
}

function objectKeys(node) {
	if (!node || !ts.isObjectLiteralExpression(node)) return null;

	const keys = [];

	for (const prop of node.properties) {
		if (!prop.name) continue;
		if (ts.isStringLiteralLike(prop.name) || ts.isIdentifier(prop.name)) keys.push(prop.name.text);
	}

	return keys;
}

function classify(side, callName, node, calleeText) {
	const arg = (i) => node.arguments[i];

	if (side === 'ui') {
		if (callName === 'register') return { kind: 'handler', transport: 'rpc', target: 'ui', name: stringArg(arg(0)) };
		if (callName === 'callServer') return { kind: 'call', transport: 'rpc', target: 'server', name: stringArg(arg(0)) };
		if (callName === 'callClient') return { kind: 'call', transport: 'rpc', target: 'client', name: stringArg(arg(0)) };
		return null;
	}

	if (side === 'client') {
		if (callName === 'subscribe') {
			const name = stringArg(arg(0));
			return { kind: 'handler', transport: 'rpc', target: 'client', name: name ?? undefined, objectArg: name ? undefined : arg(0) };
		}

		if (callName === 'register') {
			const name = stringArg(arg(0));
			return name ? { kind: 'handler', transport: 'rpc', target: 'client', name } : null;
		}

		if (callName === 'subscribeToDefault' || callName === 'add')
			return { kind: 'handler', transport: 'raw', target: 'client', objectArg: arg(0) };

		if (callName === 'callServer') return { kind: 'call', transport: 'rpc', target: 'server', name: stringArg(arg(0)) };
		if (callName === 'callRemote') return { kind: 'call', transport: 'raw', target: 'server', name: stringArg(arg(0)) };

		if (callName === 'callBrowser') {
			const name = node.arguments.map(stringArg).find((value) => value && /^[A-Za-z][\w-]*$/.test(value));
			return { kind: 'call', transport: 'rpc', target: 'ui', name: name ?? null };
		}

		return null;
	}

	if (side === 'server') {
		if (callName === 'subscribe') {
			const name = stringArg(arg(0));
			return { kind: 'handler', transport: 'rpc', target: 'server', name: name ?? undefined, objectArg: name ? undefined : arg(0) };
		}

		if (callName === 'register') {
			const name = stringArg(arg(0));
			return name ? { kind: 'handler', transport: 'rpc', target: 'server', name } : null;
		}

		if (callName === 'subscribeToDefault' || callName === 'add')
			return { kind: 'handler', transport: 'raw', target: 'server', objectArg: arg(0) };

		if (callName === 'callClient') return { kind: 'call', transport: 'rpc', target: 'client', name: stringArg(arg(1)) ?? stringArg(arg(0)) };
		if (callName === 'callBrowser') return { kind: 'call', transport: 'rpc', target: 'ui', name: stringArg(arg(0)) };

		// player.call / mp.players.call / mp.players.callInStream → clients
		if (callName === 'call' && !calleeText.startsWith('mp.events.'))
			return { kind: 'call', transport: 'raw', target: 'client', name: stringArg(arg(0)) };

		if (callName === 'callInStream')
			return { kind: 'call', transport: 'raw', target: 'client', name: stringArg(arg(1)) };

		return null;
	}

	return null;
}

function scanFile(file, side) {
	const raw = fs.readFileSync(file, 'utf8');
	const source = file.endsWith('.vue') ? maskVue(raw) : raw;
	const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
	const rel = path.relative(root, file).replace(/\\/g, '/');

	const lineOf = (node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;

	const push = (name, hit, node) => {
		if (!name) return;

		entries.push({
			name,
			side,
			kind: hit.kind,
			transport: hit.transport,
			target: hit.target,
			file: rel,
			line: lineOf(node)
		});
	};

	const visit = (node) => {
		if (ts.isCallExpression(node)) {
			const callee = node.expression;
			const callName = ts.isPropertyAccessExpression(callee)
				? callee.name.text
				: ts.isIdentifier(callee)
					? callee.text
					: null;

			if (callName && CALL_KINDS.has(callName)) {
				const calleeText = callee.getText(sf).replace(/\s+/g, '');
				const hit = classify(side, callName, node, calleeText);

				if (hit?.objectArg) {
					const keys = objectKeys(hit.objectArg);

					if (keys) for (const key of keys) push(key, hit, node);
				} else if (hit?.name !== undefined) {
					push(hit.name, hit, node);
				}
			}
		}

		ts.forEachChild(node, visit);
	};

	visit(sf);
}

const files = TARGETS.flatMap(({ side, dir, exts }) =>
	walk(path.join(root, dir), exts).map((file) => ({ file, side }))
);

for (const { file, side } of files) scanFile(file, side);

/* ------------------------------------------------------------------ analysis */

const byKey = (side, kind, transport) =>
	entries.filter((e) => e.side === side && e.kind === kind && e.transport === transport);

const handlers = {
	serverRpc: byKey('server', 'handler', 'rpc'),
	serverRaw: byKey('server', 'handler', 'raw'),
	clientRpc: byKey('client', 'handler', 'rpc'),
	clientRaw: byKey('client', 'handler', 'raw'),
	ui: byKey('ui', 'handler', 'rpc')
};

const calls = {
	uiToServer: byKey('ui', 'call', 'rpc').filter((e) => e.target === 'server'),
	uiToClient: byKey('ui', 'call', 'rpc').filter((e) => e.target === 'client'),
	clientToServer: byKey('client', 'call', 'rpc').filter((e) => e.target === 'server'),
	clientToServerRaw: byKey('client', 'call', 'raw').filter((e) => e.target === 'server'),
	clientToUi: byKey('client', 'call', 'rpc').filter((e) => e.target === 'ui'),
	serverToClient: byKey('server', 'call', 'rpc').filter((e) => e.target === 'client'),
	serverToClientRaw: byKey('server', 'call', 'raw').filter((e) => e.target === 'client')
};

const serverToClientAll = [...calls.serverToClient, ...calls.serverToClientRaw];

const names = (list) => new Set(list.map((e) => e.name));
const handNames = {
	serverRpc: names(handlers.serverRpc),
	serverRaw: names(handlers.serverRaw),
	clientRpc: names(handlers.clientRpc),
	clientRaw: names(handlers.clientRaw),
	ui: names(handlers.ui)
};

const coverage = new Map();
const touch = (name) => {
	if (!coverage.has(name))
		coverage.set(name, {
			name,
			ui2server: false,
			ui2client: false,
			client2server: false,
			client2ui: false,
			server2client: false,
			serverHandler: false,
			clientHandler: false,
			uiHandler: false
		});

	return coverage.get(name);
};

for (const e of calls.uiToServer) touch(e.name).ui2server = true;
for (const e of calls.uiToClient) touch(e.name).ui2client = true;
for (const e of calls.clientToServer) touch(e.name).client2server = true;
for (const e of calls.clientToUi) touch(e.name).client2ui = true;
for (const e of calls.serverToClient) touch(e.name).server2client = true;
for (const e of calls.serverToClientRaw) touch(e.name).server2client = true;
for (const name of handNames.serverRpc) touch(name).serverHandler = true;
for (const name of handNames.serverRaw) touch(name).serverHandler = true;
for (const name of handNames.clientRpc) touch(name).clientHandler = true;
for (const name of handNames.clientRaw) touch(name).clientHandler = true;
for (const name of handNames.ui) touch(name).uiHandler = true;

const rows = [...coverage.values()].sort((a, b) => a.name.localeCompare(b.name, 'en'));
const ok = (v) => (v ? '✅' : '—');

const missing = {
	'UI → сервер': rows.filter((r) => r.ui2server && !r.serverHandler).map((r) => r.name),
	'UI → клиент': rows.filter((r) => r.ui2client && !r.clientHandler).map((r) => r.name),
	'клиент → сервер': rows.filter((r) => r.client2server && !r.serverHandler).map((r) => r.name),
	'клиент → UI': rows.filter((r) => r.client2ui && !r.uiHandler).map((r) => r.name),
	'сервер → клиент': rows.filter((r) => r.server2client && !r.clientHandler).map((r) => r.name)
};

const rawRows = [...new Set([...handlers.serverRaw, ...handlers.clientRaw].map((e) => `${e.side}\t${e.name}`))]
	.map((key) => key.split('\t'))
	.sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));

const outDir = path.join(root, 'tools/registry');
fs.mkdirSync(outDir, { recursive: true });

const json = {
	generatedAt: new Date().toISOString(),
	counts: {
		files: files.length,
		entries: entries.length,
		serverRpc: handNames.serverRpc.size,
		serverRaw: handNames.serverRaw.size,
		clientRpc: handNames.clientRpc.size,
		clientRaw: handNames.clientRaw.size,
		uiRpc: handNames.ui.size,
		uiToServer: names(calls.uiToServer).size,
		uiToClient: names(calls.uiToClient).size,
		clientToServer: names(calls.clientToServer).size,
		clientToServerRaw: names(calls.clientToServerRaw).size,
		clientToUi: names(calls.clientToUi).size,
		serverToClient: names(serverToClientAll).size,
		serverToClientRaw: names(calls.serverToClientRaw).size
	},
	missing,
	entries
};

fs.writeFileSync(path.join(outDir, 'registry.json'), `${JSON.stringify(json, null, '\t')}\n`);

const md = [];
md.push('# Реестр RPC и событий StreetRP', '');
md.push(`Сгенерирован: ${json.generatedAt}`, '');
md.push('| Метрика | Кол-во |', '|---|---:|');
md.push(`| Просканировано файлов | ${json.counts.files} |`);
md.push(`| Всего записей | ${json.counts.entries} |`);
md.push(`| RPC-обработчиков на сервере | ${json.counts.serverRpc} |`);
md.push(`| RPC-обработчиков на клиенте | ${json.counts.clientRpc} |`);
md.push(`| RPC-обработчиков в UI | ${json.counts.uiRpc} |`);
md.push(`| Сырых событий на сервере | ${json.counts.serverRaw} |`);
md.push(`| Сырых событий на клиенте | ${json.counts.clientRaw} |`);
md.push(`| UI → сервер | ${json.counts.uiToServer} |`);
md.push(`| UI → клиент | ${json.counts.uiToClient} |`);
md.push(`| Клиент → сервер | ${json.counts.clientToServer} |`);
md.push(`| Клиент → сервер (raw) | ${json.counts.clientToServerRaw} |`);
md.push(`| Клиент → UI | ${json.counts.clientToUi} |`);
md.push(`| Сервер → клиент | ${json.counts.serverToClient} |`);
md.push(`| Сервер → клиент (raw) | ${json.counts.serverToClientRaw} |`);
md.push('', '## Покрытие обработчиками', '');
md.push('S/C handler учитывает и raw-события (`mp.events.add` / `subscribeToDefault`), не только RPC.', '');
md.push('| RPC | UI→S | UI→C | C→S | C→UI | S→C | S handler | C handler | UI handler |', '|---|---|---|---|---|---|---|---|---|');

for (const r of rows)
	md.push(
		`| \`${r.name}\` | ${ok(r.ui2server)} | ${ok(r.ui2client)} | ${ok(r.client2server)} | ${ok(r.client2ui)} | ${ok(r.server2client)} | ${ok(r.serverHandler)} | ${ok(r.clientHandler)} | ${ok(r.uiHandler)} |`
	);

md.push('', '## Вызовы без обработчиков', '');
for (const [label, list] of Object.entries(missing)) {
	md.push(`### ${label}`, '');

	if (!list.length) md.push('Нет.', '');
	else {
		for (const name of list) md.push(`- \`${name}\``);
		md.push('');
	}
}

md.push('## Сырые события (RAGE:MP → FiveM)', '');
md.push('| Сторона | Событие |', '|---|---|');
for (const [side, name] of rawRows) md.push(`| ${side} | \`${name}\` |`);
md.push('');

fs.writeFileSync(path.join(outDir, 'REGISTRY.md'), `${md.join('\n')}\n`);

console.log(
	[
		`files: ${json.counts.files}`,
		`entries: ${json.counts.entries}`,
		`server RPC: ${json.counts.serverRpc}, client RPC: ${json.counts.clientRpc}, UI RPC: ${json.counts.uiRpc}`,
		`UI→S: ${json.counts.uiToServer}, UI→C: ${json.counts.uiToClient}, C→S: ${json.counts.clientToServer}, C→UI: ${json.counts.clientToUi}`,
		`missing: ${Object.entries(missing)
			.filter(([, v]) => v.length)
			.map(([k, v]) => `${k}=${v.length}`)
			.join(', ') || 'none'}`,
		`written: tools/registry/registry.json, tools/registry/REGISTRY.md`
	].join('\n')
);
