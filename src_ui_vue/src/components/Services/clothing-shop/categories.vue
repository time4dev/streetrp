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
		watch: 'Часы'
	};

	defineProps<{
		current: string;
		setCategory: (name: string) => void;
	}>();
</script>

<template>
	<div class="clothing-shop_categories">
		<div
			v-for="(title, name) in items"
			:key="name"
			:class="['clothing-shop_categories-item', { active: current === name }]"
			@click="setCategory(name)"
		>
			<img :src="images.getImage(`${name}.svg`)" :alt="title" />
		</div>
	</div>
</template>
