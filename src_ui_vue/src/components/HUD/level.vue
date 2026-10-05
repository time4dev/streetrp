<script setup lang="ts">
	import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import { useAnimatedNumber } from '@/composables/use-animated-number';

	const visible = ref(false);
	const current = ref(0);
	const experience = ref<[number, number]>([0, 0]);

	let visibilityTimeout: ReturnType<typeof setTimeout> | undefined;

	onMounted(() => {
		rpc.register('HUD-ShowLevel', showStats);
	});

	onBeforeUnmount(() => {
		if (visibilityTimeout) clearTimeout(visibilityTimeout);

		rpc.unregister('HUD-ShowLevel');
	});

	function showStats(data: { current: number; experience: [number, number] }) {
		current.value = data.current;
		experience.value = data.experience;
		visible.value = true;

		visibilityTimeout = setTimeout(() => (visible.value = false), 6000);
	}

	const percentage = computed(() => (experience.value[0] * 100) / experience.value[1]);

	// Legacy: AnimatedNumber value={experience[0]} duration={600} formatValue={(value) => parseInt(value, 10)}
	const animatedExp = useAnimatedNumber(computed(() => experience.value[0]), 600);
	const displayExp = computed(() => Math.trunc(animatedExp.value));
</script>

<template>
	<Transition name="alert">
		<div v-if="visible" class="hud_level">
			<span class="hud_level-current">{{ current }}</span>

			<div class="hud_level-progress">
				<div class="bar">
					<progress
						v-for="item in 5"
						:key="item"
						class="bar_part"
						:value="percentage <= (item - 1) * 20 ? 0 : percentage"
						:max="item * 20"
					/>
				</div>

				<div class="hud_level-exp">
					<span>{{ displayExp }}</span> \ {{ experience[1] }}
				</div>
			</div>
		</div>
	</Transition>
</template>
