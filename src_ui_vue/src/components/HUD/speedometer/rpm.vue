<script setup lang="ts">
	import RcCircle from '@/components/Common/rc-circle.vue';

	defineProps<{
		amount: number;
	}>();
</script>

<template>
	<div class="speedometer_rpm">
		<RcCircle
			class-name="speedometer_rpm-fill"
			:stroke-width="3"
			:trail-width="3"
			trail-color="rgba(255,255,255, 0.5)"
			:stroke-color="amount > 90 ? '#d40000' : '#fce638'"
			:percent="amount"
			:gap-degree="120"
			gap-position="bottom"
			stroke-linecap="square"
		/>

		<RcCircle
			class-name="speedometer_rpm-fill"
			:stroke-width="3"
			:trail-width="3"
			trail-color="rgba(255,255,255, 0.5)"
			:stroke-color="amount > 90 ? '#d40000' : '#fce638'"
			:percent="amount"
			:gap-degree="120"
			gap-position="bottom"
			stroke-linecap="square"
		/>
	</div>
</template>
