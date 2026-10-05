<script setup lang="ts">
	import images from '@/utils/images';
	import prettify from '@/utils/prettify';

	defineProps<{
		className?: string;
		amount: number;
	}>();
</script>

<template>
	<div :class="['point', className]">
		<span>{{ prettify.price(amount).replace('$', '') }}</span>

		<svg class="point-icon">
			<use :href="`${images.getImage('point.svg')}#icon`" />
		</svg>
	</div>
</template>
