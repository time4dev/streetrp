<script setup lang="ts">
	import { IoLayers, IoImages, IoMic } from '@/utils/icons';
	import Group from '../partials/group.vue';
	import Button from '../partials/button.vue';

	defineProps<{
		openTab: (name: string) => void;
	}>();

	const tabList: Record<string, { title: string; color: string; icon: any }> = {
		keys: {
			title: 'Назначение клавиш',
			color: '#8D8E92',
			icon: IoLayers
		},
		voice: {
			title: 'Голосовой чат',
			color: '#5656D6',
			icon: IoMic
		},
		wallpaper: {
			title: 'Обои',
			color: '#30A9DC',
			icon: IoImages
		}
	};
</script>

<template>
	<div class="settings_tabs">
		<Group className="settings_tabs-list">
			<Button
				v-for="(item, key) in tabList"
				:key="key"
				className="settings_tabs-item"
				icon="arrow"
				:on-click="() => openTab(String(key))"
			>
				<i class="settings_tabs-icon" :style="{ backgroundColor: item.color }">
					<component :is="item.icon" />
				</i>

				{{ item.title }}
			</Button>
		</Group>
	</div>
</template>
