<script setup lang="ts">
	import images from '@/utils/images';
	import Key from './key.vue';

	const controls: { [name: string]: string } = {
		cursor: '`',
		inventory: 'I',
		target: 'K',
		phone: 'M',
		noHUD: '0'
	};

	defineProps<{
		items: {
			[name: string]: string;
		};
	}>();
</script>

<template>
	<div class="hud_binds">
		<ul class="hud_binds-list">
			<li v-for="(value, key, index) in controls" :key="index" class="hud_binds-item">
				<img :src="images.getImage(`${key}.svg`)" alt="bind icon" />

				<Key>{{ items[key] ?? value }}</Key>
			</li>
		</ul>
	</div>
</template>
