<script setup lang="ts">
	import images from '@/utils/images';

	defineProps<{
		label: string;
		title: string;
	}>();

	const emit = defineEmits<{ click: [] }>();

	function onHover(event: MouseEvent) {
		const { parentElement } = event.currentTarget as HTMLElement;

		if (parentElement) parentElement.classList.toggle('hover');
	}
</script>

<template>
	<li class="target-menu_cells-item disabled">
		<div class="container" @mouseenter="onHover" @mouseleave="onHover" @click="emit('click')">
			<img :src="images.getImage(`${label}.svg`)" :alt="title" />

			<span>{{ title }}</span>
		</div>
	</li>
</template>
