<script setup lang="ts">
	import { computed, onBeforeUnmount, onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import { useAnimatedNumber } from '@/composables/use-animated-number';
	import Controls from './controls.vue';
	import RPM from './rpm.vue';
	import Fuel from './fuel.vue';
	import Engine from './engine.vue';

	type SpeedometerState = {
		inVehicle: boolean;
		engine: {
			health: number;
			active: boolean;
		};
		velocity: number;
		rpm: number;
		fuel: {
			current: number;
			max: number;
		};
		locked: boolean;
		seatbelt: boolean;
		cruise: boolean;
	};

	const props = defineProps<{
		binds: {
			[name: string]: string;
		};
	}>();

	const state = reactive<SpeedometerState>({
		inVehicle: false,
		engine: {
			health: 100,
			active: false
		},
		velocity: 0,
		rpm: 0,
		fuel: {
			current: 0,
			max: 100
		},
		locked: false,
		seatbelt: false,
		cruise: false
	});

	onMounted(() => {
		rpc.register('Speedometer-UpdateState', (data: Partial<SpeedometerState>) =>
			Object.assign(state, data)
		);
	});

	onBeforeUnmount(() => {
		rpc.unregister('Speedometer-UpdateState');
	});

	// Legacy: AnimatedNumber value={velocity} duration={300} formatValue={parseInt + padStart(3, '0')}
	const animatedVelocity = useAnimatedNumber(computed(() => state.velocity), 300);
	const displayVelocity = computed(() =>
		Math.trunc(animatedVelocity.value)
			.toString()
			.padStart(3, '0')
	);
</script>

<template>
	<div v-if="state.inVehicle" :class="['speedometer', { active: state.engine.active }]">
		<div class="speedometer_velocity">
			<span>{{ displayVelocity }}</span>

			<h5>КМ\Ч</h5>
		</div>

		<RPM :amount="state.engine.active ? state.rpm : 0" />
		<Fuel :amount="(state.fuel.current * 100) / state.fuel.max" />
		<Engine :health="state.engine.health" />

		<Controls
			:binds="props.binds"
			:engine="state.engine.active"
			:cruise="state.cruise"
			:lock="state.locked"
			:seatbelt="state.seatbelt"
		/>
	</div>
</template>
