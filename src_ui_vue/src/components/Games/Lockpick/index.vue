<script setup lang="ts">
	import { onMounted, reactive, ref } from 'vue';
	import { random } from 'lodash-es';
	import rpc from '@/utils/rpc';
	import sound from '@/assets/audio/lockpick.mp3';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import Hint from '@/components/Common/hint.vue';
	import Circle from './circle.vue';
	import Locks from './locks.vue';

	type Rotations = {
		point: number;
		pointer: number;
	};

	type State = {
		counter: number;
		need: number;

		rotations: Rotations;
	};

	const state = reactive<State>({
		counter: 0,
		need: 6,

		rotations: {
			point: 0,
			pointer: 0
		}
	});

	// Legacy: React.createRef() passed down to <Circle> as props.
	// Kept in a plain object so the refs are not auto-unwrapped in the template.
	const elementRefs = {
		point: ref<HTMLDivElement | null>(null),
		pointer: ref<HTMLDivElement | null>(null)
	};

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);

		rotate('point', random(0, 360));
	});

	function rotate(element: keyof Rotations, deg: number) {
		state.rotations[element] = deg;
	}

	function getRotationAngle(element: HTMLDivElement) {
		const matrix = window.getComputedStyle(element).getPropertyValue('transform');

		const values = matrix.split('(')[1].split(')')[0].split(',');
		const a = +values[0];
		const b = +values[1];

		return Math.round(Math.atan2(b, a) * (180 / Math.PI));
	}

	async function onCircleClick() {
		const pointerElement = elementRefs.pointer.value;
		const pointElement = elementRefs.point.value;

		if (!pointerElement || !pointElement) return;

		const pointerAngle = getRotationAngle(pointerElement);
		const pointAngle = getRotationAngle(pointElement);

		if (pointerAngle > pointAngle - 20 && pointerAngle < pointAngle + 20) {
			state.counter += 1;

			new Audio(sound).play();

			if (state.counter >= state.need) await rpc.callClient('Lockpick-Success');
			else rotate('point', random(0, 360));
		} else {
			await rpc.callClient('Lockpick-Error');
		}
	}
</script>

<template>
	<div class="lockpick">
		<PrimaryTitle class-name="lockpick_title">Взлом транспорта</PrimaryTitle>

		<div class="lockpick_container">
			<Circle
				:point="elementRefs.point"
				:pointer="elementRefs.pointer"
				:rotations="state.rotations"
				@click="onCircleClick"
			/>
			<Locks :amount="state.need" :opened="state.counter" />

			<div class="lockpick_info">
				<Hint action="click">Нажмите в центре круга</Hint>

				<p class="lockpick_info-item">Попадите <b>{{ state.need }}</b> {{ state.need > 4 ? 'раз' : 'раза' }} в кольцо</p>
			</div>
		</div>

		<OutlineButton class-name="lockpick_close" @click="rpc.callClient('Lockpick-Cancel')">
			Закрыть
		</OutlineButton>
	</div>
</template>
