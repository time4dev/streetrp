import { onBeforeUnmount, reactive } from 'vue';

/**
 * Pointer-based drag & drop replacement for react-dnd (TouchBackend with mouse events).
 *
 * The legacy inventory used one drag type ('item') and drop targets (cells)
 * that resolved drops through props or React context. Here:
 *  - drag sources call `startDrag(payload)` on pointerdown;
 *  - drop targets register a handler by unique key (`${storage}:${id}`);
 *  - while dragging, the hovered target is resolved with document.elementFromPoint,
 *    so cells get the same `is-over` class react-dnd produced;
 *  - on pointerup the handler of the hovered target is invoked with
 *    (sourceId, targetId, storage) exactly like the legacy drop callbacks.
 */
export type DndItem = {
	id: number | string;
	name: string;
	storage: string;
};

type DropHandler = (sourceId: number | string, targetId: number | string, storage: string) => void;

export const dndState = reactive({
	item: null as DndItem | null,
	x: 0,
	y: 0,
	overKey: null as string | null,
	moved: false
});

const dropHandlers = new Map<string, DropHandler>();

let startX = 0;
let startY = 0;
let listening = false;

function findTargetKey(clientX: number, clientY: number): string | null {
	const element = document.elementFromPoint(clientX, clientY);
	const target = element?.closest('[data-dnd-key]') as HTMLElement | null;

	if (!target) return null;
	if (target.dataset.dndBlocked === 'true') return null;

	return target.dataset.dndKey ?? null;
}

function onPointerMove(event: PointerEvent) {
	dndState.x = event.clientX;
	dndState.y = event.clientY;

	if (Math.abs(event.clientX - startX) > 3 || Math.abs(event.clientY - startY) > 3) {
		dndState.moved = true;
	}

	dndState.overKey = findTargetKey(event.clientX, event.clientY);
}

function onPointerUp() {
	const key = dndState.overKey;
	const item = dndState.item;

	if (key && item && dndState.moved) {
		const handler = dropHandlers.get(key);

		if (handler) {
			const target = document.querySelector(`[data-dnd-key="${key}"]`) as HTMLElement | null;

			handler(item.id, target?.dataset.dndId ?? 0, target?.dataset.dndStorage ?? 'self');
		}
	}

	dndState.item = null;
	dndState.overKey = null;

	document.removeEventListener('pointermove', onPointerMove);
	document.removeEventListener('pointerup', onPointerUp);

	listening = false;
}

export function useDnd() {
	function startDrag(item: DndItem, event: PointerEvent) {
		if (event.button !== 0) return;

		dndState.item = item;
		dndState.x = event.clientX;
		dndState.y = event.clientY;
		dndState.moved = false;
		startX = event.clientX;
		startY = event.clientY;

		if (!listening) {
			document.addEventListener('pointermove', onPointerMove);
			document.addEventListener('pointerup', onPointerUp);

			listening = true;
		}
	}

	function registerDrop(key: string, handler: DropHandler) {
		dropHandlers.set(key, handler);

		onBeforeUnmount(() => {
			if (dropHandlers.get(key) === handler) dropHandlers.delete(key);
		});
	}

	return { startDrag, registerDrop };
}
