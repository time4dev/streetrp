<script setup lang="ts">
	import { computed, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import Cell from './cell.vue';

	const props = defineProps<{
		showCells: () => void;
	}>();

	const categories = {
		stop: 'Остановить',
		stand: 'Стойки',
		social: 'Cоциальные',
		dance: 'Танцы',
		sport: 'Спорт',
		others: 'Другие'
	};

	const category = ref<string>();
	const items = ref<{ [type: string]: string[] }>({});

	const currentItems = computed(() =>
		category.value && items.value[category.value] ? items.value[category.value] : null
	);

	async function selectCategory(type: string) {
		if (items.value[type]) return;

		const anims = await rpc.callClient('PlayerAnims-GetList', type);
		if (!anims) return playAnim();

		items.value = { ...items.value, [type]: anims };
		category.value = type;
		props.showCells();
	}

	function playAnim(id?: number) {
		rpc.callClient('PlayerAnims-SetAnim', [category.value, id]);
	}
</script>

<template>
	<Cell
		v-for="(item, index) in currentItems ?? []"
		:key="item"
		:label="category ?? ''"
		:title="item"
		@click="playAnim(index)"
	/>

	<Cell
		v-for="[type, name] in currentItems ? [] : Object.entries(categories)"
		:key="type"
		:label="type"
		:title="name"
		@click="selectCategory(type)"
	/>
</template>
