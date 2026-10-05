<script setup lang="ts">
	import images from '@/utils/images';

	const items = {
		hat: 'Головной убор',
		jacket: 'Куртка',
		shirt: 'Футболка',
		pants: 'Брюки',
		shoes: 'Обувь',
		glasses: 'Очки',
		mask: 'Маска',
		accessories: 'Аксессуары',
		watch: 'Часы',
		decals: 'Нашивки'
	};

	defineProps<{
		current: string;
	}>();

	const emit = defineEmits<{ 'set-category': [name: string] }>();
</script>

<template>
	<div class="faction-wardrobe_categories">
		<div
			v-for="(title, name) in items"
			:key="name"
			:class="['faction-wardrobe_categories-item', { active: current === name }]"
			@click="emit('set-category', name)"
		>
			<img :src="images.getImage(`${name}.svg`)" :alt="title" />
		</div>
	</div>
</template>
