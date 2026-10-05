/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue';

	const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
	export default component;
}

declare module 'rage-rpc';

interface Window {
	mp: any;
	rpcDev?: {
		/** Dev mode: emulate an incoming RPC event (e.g. rpcDev.call('Browser-ShowPage', 'auth')) */
		call: (name: string, ...args: any[]) => void;
		/** Dev mode: list locally registered handlers */
		list: () => string[];
	};
	chatAPI?: {
		push: (text: string) => void;
		activate: (status: boolean) => void;
		show: (status: boolean) => void;
	};
}

declare const mp: {
	events: {
		add: (name: string, handler: (...args: any[]) => void) => void;
		remove: (name: string, handler?: (...args: any[]) => void) => void;
		call: (name: string, ...args: any[]) => void;
		callRemote?: (name: string, ...args: any[]) => void;
	};
	invoke: (name: string, ...args: any[]) => void;
	trigger: (name: string, ...args: any[]) => void;
};
