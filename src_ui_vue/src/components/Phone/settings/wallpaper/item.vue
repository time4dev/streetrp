<script setup lang="ts">
	import images from '@/utils/images';

	defineProps<{
		name: string;
		selected: boolean;
		select: (name: string) => void;
	}>();
</script>

<template>
	<div
		:class="['settings_wallpaper-item', { active: selected }]"
		@click="select(name)"
	>
		<img :src="images.getImage(`${name}_wp.jpg`, 'phone')" :alt="name" />
	</div>
</template>
