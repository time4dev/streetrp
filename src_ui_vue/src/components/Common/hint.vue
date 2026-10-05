<script setup lang="ts">
	import images from '@/utils/images';

	const icons = {
		click: 'mouse-left',
		drag: 'mouse-drag',
		exit: 'esc-key'
	} as const;

	defineProps<{
		className?: string;
		action: keyof typeof icons;
	}>();
</script>

<template>
	<div :class="['hint', className]">
		<img
			class="hint_icon"
			:src="images.getImage(`${icons[action]}.svg`)"
			:alt="icons[action]"
		/>

		<span class="hint_text"><slot /></span>
	</div>
</template>
