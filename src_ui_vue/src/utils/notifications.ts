import { reactive } from 'vue';
import rpc from './rpc';

export type NotificationType = 'info' | 'warn' | 'error' | 'success';
export type ToastItem = { id: number; type: NotificationType; message: string };

export type Container = 'hud' | 'menu';

let nextId = 1;

export const toastState = reactive<Record<Container, ToastItem[]>>({
	hud: [],
	menu: []
});

const timers = new Map<number, ReturnType<typeof setTimeout>>();

function dismiss(container: Container, id: number) {
	const list = toastState[container];
	const index = list.findIndex((toast) => toast.id === id);

	if (index !== -1) list.splice(index, 1);

	const timer = timers.get(id);

	if (timer) {
		clearTimeout(timer);
		timers.delete(id);
	}
}

// react-toastify configuration from the legacy app:
// autoClose 2300ms, limit 1 per container, newest on top, no close button.
export function showNotification(type: NotificationType, message: string, inMenu = true) {
	const container: Container = inMenu ? 'menu' : 'hud';
	const list = toastState[container];

	// clearWaitingQueue + limit 1: the newest notification replaces the current one
	for (const toast of list) dismiss(container, toast.id);

	const id = nextId++;

	list.push({ id, type, message });

	timers.set(
		id,
		setTimeout(() => dismiss(container, id), 2300)
	);
}

rpc.register('Notifications-ShowItem', (type: NotificationType, message: string, inMenu: boolean) => {
	showNotification(type, message, inMenu);
});
