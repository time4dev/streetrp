<script setup lang="ts">
	import { FaGasPump } from '@/utils/icons';
	import RcCircle from '@/components/Common/rc-circle.vue';

	defineProps<{
		amount: number;
	}>();
</script>

<template>
	<div class="speedometer_fuel">
		<FaGasPump class="speedometer_fuel-icon" />

		<RcCircle
			class-name="speedometer_fuel-fill"
			:stroke-width="3"
			:trail-width="3"
			trail-color="rgba(255,255,255, 0.5)"
			stroke-color="#ff0082"
			:percent="amount"
			:gap-degree="225"
			gap-position="bottom"
			stroke-linecap="square"
		/>
	</div>
</template>
