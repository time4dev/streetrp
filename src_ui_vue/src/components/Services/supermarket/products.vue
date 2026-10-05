<script setup lang="ts">
	import images from '@/utils/images';
	import prettify from '@/utils/prettify';
	import inventoryItems from '@/data/inventory.json';
	import Hint from './hint.vue';

	defineProps<{
		items: { [name: string]: number };
		selected?: string;
		selectItem: (name: string) => void;
	}>();
</script>

<template>
	<div class="supermarket_products">
		<Hint>1. Выберите товар</Hint>

		<div class="supermarket_products-list">
			<div
				v-for="(price, name) in items"
				:key="name"
				:class="['supermarket_products-item', { active: selected === name }]"
				@click="selectItem(name)"
			>
				<h4>{{ (inventoryItems as any)[name].name }}</h4>

				<img :src="images.getImage(`${name}.png`, 'inventory')" :alt="name" />

				<span>{{ prettify.price(price) }}</span>
			</div>
		</div>
	</div>
</template>
