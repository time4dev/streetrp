<script setup lang="ts">
	import RcSlider from '@/components/Common/rc-slider.vue';

	defineProps<{
		title: string;
		value: number;
		min: number;
		max: number;
		step?: number;
	}>();

	const emit = defineEmits<{ change: [value: number] }>();
</script>

<template>
	<div class="character_slider">
		<h4 class="character_param-title">{{ title }}</h4>

		<RcSlider
			:value="value"
			:min="min"
			:max="max"
			:step="step"
			@change="emit('change', $event)"
		/>
	</div>
</template>
