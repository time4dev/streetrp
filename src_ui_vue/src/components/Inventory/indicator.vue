<script setup lang="ts">
	import { FaWeightHanging, FaHamburger } from '@/utils/icons';
	import RcCircle from '@/components/Common/rc-circle.vue';

	defineProps<{
		type: 'weight' | 'satiety';
		title: string;
		current: number;
		max: number;
	}>();
</script>

<template>
	<div class="inventory_indicator">
		<div class="inventory_indicator-container">
			<RcCircle
				className="inventory_indicator-circle"
				:stroke-width="8"
				:trail-width="8"
				trail-color="rgba(255,255,255, 0.5)"
				stroke-color="#ff0082"
				stroke-linecap="square"
				:percent="(current * 100) / max"
			/>

			<FaWeightHanging v-if="type === 'weight'" className="inventory_indicator-icon" />
			<FaHamburger v-else className="inventory_indicator-icon" />
		</div>

		<div class="inventory_indicator-info">
			<h4 class="inventory_indicator-title">{{ title }}</h4>

			<span>
				<b class="inventory_indicator-current">{{ current.toFixed(1) }}</b> /
				<b class="inventory_indicator-max">
					{{ max }} {{ type === 'weight' ? 'кг' : '%' }}
				</b>
			</span>
		</div>
	</div>
</template>
