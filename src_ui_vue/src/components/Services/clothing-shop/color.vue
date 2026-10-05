<script setup lang="ts">
	import RcSlider from '@/components/Common/rc-slider.vue';

	defineProps<{
		current: number;
		amount: number;
		setColor: (index: number) => void;
	}>();
</script>

<template>
	<div class="clothing-shop_color">
		<h4 class="clothing-shop_color-title">Цвет</h4>

		<RcSlider :value="current" :min="0" :max="amount - 1" @change="setColor" />
	</div>
</template>
