<script setup lang="ts">
	import { computed } from 'vue';
	import { IoIosPerson } from '@/utils/icons';
	import images from '@/utils/images';
	import { useAnimatedNumber } from '@/composables/use-animated-number';

	const props = defineProps<{
		playerId: number;
		count: number;
	}>();

	// Legacy: AnimatedNumber value={count} duration={300} formatValue={parseInt}
	const animatedCount = useAnimatedNumber(computed(() => props.count), 300);
	const displayCount = computed(() => Math.trunc(animatedCount.value));
</script>

<template>
	<div class="hud_online">
		<div class="hud_online-logo">
			<img :src="images.getImage('logo.svg')" alt="StreetRP logo" />
		</div>

		<div class="hud_online-container">
			<p class="player-id">ID:{{ playerId }}</p>

			<div class="hud_online-count">
				<IoIosPerson />

				<span>{{ displayCount }}</span>
			</div>
		</div>
	</div>
</template>
