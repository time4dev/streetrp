<script setup lang="ts">
	import { ref } from 'vue';
	import Tabs from 'primevue/tabs';
	import TabList from 'primevue/tablist';
	import Tab from 'primevue/tab';
	import TabPanels from 'primevue/tabpanels';
	import TabPanel from 'primevue/tabpanel';
	import Creator from './creator.vue';
	import Despawn from './despawn.vue';

	const active = ref('create');
</script>

<template>
	<div class="admin__pane">
		<h3 class="admin__pane-title">Транспорт</h3>

		<Tabs v-model:value="active">
			<TabList>
				<Tab value="create">Создать</Tab>
				<Tab value="despawn">Эвакуировать</Tab>
			</TabList>

			<TabPanels>
				<TabPanel value="create">
					<Creator />
				</TabPanel>

				<TabPanel value="despawn">
					<Despawn />
				</TabPanel>
			</TabPanels>
		</Tabs>
	</div>
</template>
