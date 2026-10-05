<script setup lang="ts">
	import images from '@/utils/images';
	import RcCircle from '@/components/Common/rc-circle.vue';

	defineProps<{
		health: number;
	}>();
</script>

<template>
	<div class="speedometer_engine">
		<svg class="speedometer_engine-icon">
			<use :href="`${images.getImage('engine.svg')}#icon`" />
		</svg>

		<RcCircle
			class-name="speedometer_engine-fill"
			:stroke-width="3"
			:trail-width="3"
			trail-color="rgba(255,255,255, 0.5)"
			stroke-color="#d257d6"
			:percent="health"
			:gap-degree="225"
			gap-position="bottom"
			stroke-linecap="square"
		/>
	</div>
</template>
