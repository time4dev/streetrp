<script setup lang="ts">
	import images from '@/utils/images';

	const items = {
		head: 'Голова',
		torso: 'Торс',
		leftarm: 'Левая рука',
		rightarm: 'Правая рука',
		leftleg: 'Левая нога',
		rightleg: 'Правая нога'
	};

	defineProps<{
		current: string;
		setCategory: (name: string) => void;
	}>();
</script>

<template>
	<div class="tattoo-shop_categories">
		<div
			v-for="(title, name) in items"
			:key="name"
			:class="['tattoo-shop_categories-item', { active: current === name }]"
			@click="setCategory(name)"
		>
			<img :src="images.getImage(`${name}.svg`)" :alt="title" />
		</div>
	</div>
</template>
