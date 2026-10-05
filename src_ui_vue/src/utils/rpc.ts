import { isArray } from 'lodash-es';
import rpcLib from 'rage-rpc';

// RAGE:MP injects window.mp into CEF before scripts run. In a plain browser
// (pnpm dev without the game) index.html installs a no-op mock (`__mock: true`).
// Without RAGE the UI still boots: rpc.register is stored locally and every
// callServer/callClient is rejected immediately instead of hanging forever.
const mpApi = typeof window !== 'undefined' ? (window as any).mp : undefined;
const isRageAvailable = Boolean(mpApi?.trigger) && mpApi?.__mock !== true;

if (!isRageAvailable && typeof console !== 'undefined') {
	console.warn(
		'[rpc] RAGE:MP environment not detected — the UI runs in browser dev mode. ' +
			'rpc.callServer/callClient are rejected, rpc.register is stored locally. ' +
			'Emulate incoming events from the console: rpcDev.call("Browser-ShowPage", "auth")'
	);
}

type RpcHandler = (...args: any[]) => void;

class RPC {
	private localHandlers = new Map<string, RpcHandler>();

	register(name: string, callback: (...args: any[]) => void) {
		if (!isRageAvailable) {
			this.localHandlers.set(name, callback);
			return;
		}

		rpcLib.register(name, (data: any) => {
			return isArray(data) ? callback(...data) : callback(data);
		});
	}

	unregister(name: string) {
		if (!isRageAvailable) {
			this.localHandlers.delete(name);
			return;
		}

		rpcLib.unregister(name);
	}

	async callServer(name: string, args?: any) {
		if (!isRageAvailable) return this.unavailable(name);

		const response = await rpcLib.callServer(name, args);

		return response?.err ? Promise.reject(response.err) : response;
	}

	async callClient(name: string, args?: any) {
		if (!isRageAvailable) return this.unavailable(name);

		const response = await rpcLib.callClient(name, args);

		return response?.err ? Promise.reject(response.err) : response;
	}

	private unavailable(name: string): Promise<never> {
		return Promise.reject(
			new Error(
				`[rpc] "${name}" unavailable: RAGE:MP environment is not running (browser dev mode)`
			)
		);
	}

	/**
	 * Dev only: invokes a locally registered handler, emulating an incoming
	 * event from the server/client. Exposed as `rpcDev.call(name, ...args)`.
	 */
	private emitLocal(name: string, ...args: any[]) {
		const handler = this.localHandlers.get(name);

		if (!handler) {
			console.warn(`[rpc] no local handler registered for "${name}"`);
			return;
		}

		handler(...args);
	}
}

const rpc = new RPC();

if (!isRageAvailable && typeof window !== 'undefined') {
	(window as any).rpcDev = {
		call: (name: string, ...args: any[]) => rpc['emitLocal'](name, ...args),
		list: () => [...rpc['localHandlers'].keys()]
	};
}

export default rpc;
