<script setup lang="ts">
	import images from '@/utils/images';

	const items: { [name: string]: { title: string; gauge?: string } } = {
		melee: {
			title: 'Ближний бой'
		},
		handguns: {
			title: 'Пистолеты',
			gauge: 'Малый калибр'
		},
		rifles: {
			title: 'Винтовки',
			gauge: 'Крупный калибр'
		},
		shotguns: {
			title: 'Дробовики',
			gauge: 'Дробь'
		}
	};

	defineProps<{
		current: string;
		select: (name: string) => void;
	}>();
</script>

<template>
	<div class="weapons_categories">
		<div
			v-for="(item, name) in items"
			:key="name"
			:class="['weapons_categories-item', { active: current === name }]"
			@click="select(name)"
		>
			<h3 class="weapons_categories-title">{{ item.title }}</h3>

			<div class="container">
				<img :src="images.getImage(`${name}.svg`)" :alt="item.title" />

				<span class="weapons_categories-gauge">{{ item.gauge }}</span>
			</div>
		</div>
	</div>
</template>
