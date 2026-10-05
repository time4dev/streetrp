<script setup lang="ts">
	import { isEqual } from 'lodash-es';

	const colors = [
		[25, 67, 214],
		[109, 207, 246],
		[255, 255, 255],
		[0, 0, 0],
		[60, 184, 120],
		[237, 28, 36],
		[0, 33, 87],
		[135, 129, 189],
		[252, 230, 56],
		[255, 0, 130],
		[210, 87, 214],
		[149, 149, 149]
	];

	defineProps<{
		current: number[];
		select: (color: number[]) => void;
	}>();
</script>

<template>
	<div class="vehicle-shop_color">
		<h3 class="vehicle-shop_color-title">Выберите цвет</h3>

		<div class="vehicle-shop_color-container">
			<div
				v-for="(item, index) in colors"
				:key="index"
				:class="['vehicle-shop_color-item', { active: isEqual(item, current) }]"
				:style="{ backgroundColor: `rgb(${item})` }"
				@click="select(item)"
			/>
		</div>
	</div>
</template>
