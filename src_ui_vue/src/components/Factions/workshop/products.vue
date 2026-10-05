<script setup lang="ts">
	import images from '@/utils/images';
	import prettify from '@/utils/prettify';
	import inventoryItems from '@/data/inventory.json';
	import Hint from './hint.vue';

	const inventory = inventoryItems as Record<string, { name: string }>;

	defineProps<{
		items: { [name: string]: number };
		selected?: string;
	}>();

	const emit = defineEmits<{ 'select-item': [name: string] }>();
</script>

<template>
	<div class="workshop_products">
		<Hint>1. Выберите предмет</Hint>

		<div class="workshop_products-list">
			<div
				v-for="(price, name) in items"
				:key="name"
				:class="['workshop_products-item', { active: selected === name }]"
				@click="emit('select-item', name)"
			>
				<h4>{{ inventory[name].name }}</h4>

				<img :src="images.getImage(`${name}.png`, 'inventory')" :alt="name" />

				<span>{{ prettify.materials(price) }}</span>
			</div>
		</div>
	</div>
</template>
