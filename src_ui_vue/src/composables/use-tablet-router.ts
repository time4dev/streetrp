import { reactive } from 'vue';

// Framework7 View router replacement: a page stack with props,
// replicating f7router.navigate(path, { props }) / back() / reloadAll links.
export type TabletRoute = {
	path: string;
	props?: Record<string, any>;
};

const state = reactive({
	stack: [] as TabletRoute[]
});

export function useTabletRouter() {
	function navigate(path: string, props?: Record<string, any>, options?: { reloadAll?: boolean }) {
		if (options?.reloadAll) state.stack = [{ path, props }];
		else state.stack.push({ path, props });
	}

	function back() {
		if (state.stack.length > 1) state.stack.pop();
		else state.stack = [];
	}

	function resolve(link: string): string {
		if (link.startsWith('/') || link === '#') return link;

		const current = state.stack[state.stack.length - 1]?.path ?? '/';
		const dir = current.slice(0, current.lastIndexOf('/') + 1);

		return `${dir}${link}`;
	}

	return { state, navigate, back, resolve };
}
