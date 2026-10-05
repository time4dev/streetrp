import { onBeforeUnmount, onMounted, ref } from 'vue';
import rpc from '@/utils/rpc';

/**
 * Port of the legacy `withRotation` HOC: rotates the character while
 * dragging with the mouse on the page background.
 */
export function useRotation() {
	const active = ref(false);
	const position = ref(0);

	function onMouseDown(event: MouseEvent) {
		const parentNode = (event.target as HTMLElement)?.parentNode as HTMLElement | null;

		if (parentNode?.id !== 'root' && parentNode !== document.body) return;

		active.value = true;
		position.value = event.clientX;
	}

	function onMouseUp() {
		active.value = false;
		position.value = 0;

		rpc.callClient('playerStopRotation');
	}

	function rotateCamera(event: MouseEvent) {
		const x = event.clientX;

		if (!active.value || position.value === x) return;

		position.value = x;

		rpc.callClient('playerRotation', position.value < x);
	}

	onMounted(() => {
		document.addEventListener('mousedown', onMouseDown);
		document.addEventListener('mouseup', onMouseUp);
		document.addEventListener('mousemove', rotateCamera);
	});

	onBeforeUnmount(() => {
		document.removeEventListener('mousedown', onMouseDown);
		document.removeEventListener('mouseup', onMouseUp);
		document.removeEventListener('mousemove', rotateCamera);
	});

	return { active, position };
}
