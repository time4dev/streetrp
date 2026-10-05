<script setup lang="ts">
	import rpc from '@/utils/rpc';
	import Navigation from '../../partials/navigation.vue';
	import Item from './item.vue';

	const props = defineProps<{
		current: string;
		close: () => void;
	}>();

	async function changeWallpaper(name: string) {
		await rpc.callClient('Phone-SetWallpaper', name);
	}
</script>

<template>
	<div class="settings_wallpaper">
		<Navigation title="Обои" :close="{ title: 'Настройки', onClick: props.close }" />

		<div class="settings_wallpaper-items">
			<Item
				v-for="item in 9"
				:key="item"
				:name="String(item - 1)"
				:selected="props.current === String(item - 1)"
				:select="changeWallpaper"
			/>
		</div>
	</div>
</template>
