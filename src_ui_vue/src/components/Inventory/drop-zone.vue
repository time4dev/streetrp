<script setup lang="ts">
	import Cell from './cell.vue';

	const props = defineProps<{
		onDrop: (id: number) => void;
	}>();

	function handleDrop(sourceId: number | string) {
		props.onDrop(sourceId as number);
	}
</script>

<template>
	<div class="inventory_drop">
		<div class="inventory_drop-info">
			<h3 class="inventory_drop-title">Выбросить предмет</h3>
			<p class="inventory_drop-desc">Перетащите его сюда</p>
		</div>

		<Cell class="inventory_drop-cell" :id="228" :on-drop="handleDrop" />
	</div>
</template>
