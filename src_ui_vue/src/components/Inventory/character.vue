<script setup lang="ts">
	import images from '@/utils/images';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import DropZone from './drop-zone.vue';
	import Item from './item.vue';
	import Cell from './cell.vue';
	import type { InventoryItem } from './index.vue';

	const clothes: Record<string, string> = {
		glasses: 'Очки',
		hat: 'Головной убор',
		mask: 'Маска',
		accessories: 'Аксессуары',
		jacket: 'Куртка',
		shirt: 'Футболка',
		watch: 'Часы',
		pants: 'Брюки',
		shoes: 'Обувь'
	};
	const equipment: Record<string, string> = {
		ammo: 'Патроны',
		armor: 'Бронежилет',
		hands: 'Руки',
		backpack: 'Рюкзак'
	};

	const props = defineProps<{
		use: (id: number) => void;
		drop: (id: number) => void;
		items: { [name: string]: InventoryItem };
	}>();

	function handleUseDrop(sourceId: number | string) {
		props.use(sourceId as number);
	}

	function getWearingItem(name: string) {
		const item = props.items[name];

		return item ? { item } : null;
	}
</script>

<template>
	<div class="inventory_character">
		<div class="inventory_character-container">
			<PrimaryTitle className="inventory_title">Персонаж</PrimaryTitle>

			<div class="inventory_character-clothes">
				<div v-for="(title, key) in clothes" :key="key" class="inventory_character-item">
					<h5 class="inventory_character-title">{{ title }}</h5>

					<Cell :id="key" :on-drop="handleUseDrop">
						<Item
							v-if="getWearingItem(key as string)"
							:id="key"
							:name="getWearingItem(key as string)!.item.name"
							:amount="1"
							hide-amount
						/>

						<img v-else :src="images.getImage(`${key}.svg`)" :alt="title" />
					</Cell>
				</div>
			</div>

			<div class="inventory_character-equipment">
				<div v-for="(title, key) in equipment" :key="key" class="inventory_character-item">
					<h5 class="inventory_character-title">{{ title }}</h5>

					<Cell :id="key" :on-drop="handleUseDrop">
						<Item
							v-if="getWearingItem(key as string)"
							:id="key"
							:name="getWearingItem(key as string)!.item.name"
							:amount="1"
							hide-amount
						/>

						<img v-else :src="images.getImage(`${key}.svg`)" :alt="title" />
					</Cell>
				</div>
			</div>
		</div>

		<DropZone :on-drop="props.drop" />
	</div>
</template>
