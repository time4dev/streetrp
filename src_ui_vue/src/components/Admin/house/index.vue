<script setup lang="ts">
	import { ref } from 'vue';
	import Tabs from 'primevue/tabs';
	import TabList from 'primevue/tablist';
	import Tab from 'primevue/tab';
	import TabPanels from 'primevue/tabpanels';
	import TabPanel from 'primevue/tabpanel';
	import Creator from './creator.vue';
	import Destroyer from './destroyer.vue';

	const active = ref('create');
</script>

<template>
	<div class="admin__pane">
		<h3 class="admin__pane-title">Дома</h3>

		<Tabs v-model:value="active">
			<TabList>
				<Tab value="create">Создать</Tab>
				<Tab value="delete">Удалить</Tab>
			</TabList>

			<TabPanels>
				<TabPanel value="create">
					<Creator />
				</TabPanel>

				<TabPanel value="delete">
					<Destroyer />
				</TabPanel>
			</TabPanels>
		</Tabs>
	</div>
</template>
