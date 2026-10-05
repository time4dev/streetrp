<script setup lang="ts">
	import { computed, type CSSProperties } from 'vue';
	import { dndState } from '@/composables/use-dnd';
	import images from '@/utils/images';

	const style = computed<CSSProperties>(() =>
		dndState.item
			? {
					position: 'fixed',
					left: `${dndState.x}px`,
					top: `${dndState.y}px`,
					transform: 'translate(-50%, -50%)',
					pointerEvents: 'none'
				}
			: {}
	);
</script>

<template>
	<div v-if="dndState.item" class="inventory_preview" :style="style">
		<img :src="images.getImage(`${dndState.item.name}.png`, 'inventory')" :alt="dndState.item.name" />
	</div>
</template>
