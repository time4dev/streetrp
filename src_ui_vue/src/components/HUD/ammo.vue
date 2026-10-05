<script setup lang="ts">
	import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import images from '@/utils/images';
	import { useAnimatedNumber } from '@/composables/use-animated-number';

	const count = ref<number>(0);

	// Legacy: AnimatedNumber value={count} duration={200} formatValue={parseInt}
	const animatedCount = useAnimatedNumber(count, 200);
	const displayCount = computed(() => Math.trunc(animatedCount.value));

	onMounted(() => {
		rpc.register('HUD-SetAmmo', (value: number) => (count.value = value));

		rpc.callClient('getCurrentAmmo').then((value: number) => (count.value = value));
	});

	onBeforeUnmount(() => {
		rpc.unregister('HUD-SetAmmo');
	});
</script>

<template>
	<div v-if="count" class="hud_ammo">
		<span class="hud_ammo-count">{{ displayCount }}</span>

		<svg class="hud_ammo-icon">
			<use :href="`${images.getImage('ammo.svg')}#icon`" />
		</svg>
	</div>
</template>
