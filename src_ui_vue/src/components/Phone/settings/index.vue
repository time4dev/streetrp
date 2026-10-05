<script setup lang="ts">
	import { ref } from 'vue';
	import { usePhoneStore } from '@/stores/phone';
	import Title from '../partials/title.vue';
	import Tabs from './tabs.vue';
	import Keys from './keys/index.vue';
	import Wallpaper from './wallpaper/index.vue';
	import Voice from './voice/index.vue';

	const phoneStore = usePhoneStore();

	const activeTab = ref<string | undefined>(undefined);

	function openTab(name?: string) {
		activeTab.value = name;
	}
</script>

<template>
	<div class="settings">
		<Keys v-if="activeTab === 'keys'" :close="() => openTab(undefined)" />

		<Voice v-else-if="activeTab === 'voice'" :close="() => openTab(undefined)" />

		<Wallpaper
			v-else-if="activeTab === 'wallpaper'"
			:current="phoneStore.wallpaper"
			:close="() => openTab(undefined)"
		/>

		<div v-else class="settings_main">
			<Title className="settings_main-title">Настройки</Title>

			<Tabs :open-tab="openTab" />
		</div>
	</div>
</template>
