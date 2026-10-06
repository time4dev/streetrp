<script setup lang="ts">
	import { ref } from 'vue';
	import Tabs from 'primevue/tabs';
	import TabList from 'primevue/tablist';
	import Tab from 'primevue/tab';
	import TabPanels from 'primevue/tabpanels';
	import TabPanel from 'primevue/tabpanel';
	import BanForm from './ban.vue';
	import Unban from './unban.vue';

	const active = ref('ban');
</script>

<template>
	<div class="admin__pane">
		<h3 class="admin__pane-title">Баны</h3>

		<Tabs v-model:value="active">
			<TabList>
				<Tab value="ban">Забанить</Tab>
				<Tab value="unban">Разбанить</Tab>
			</TabList>

			<TabPanels>
				<TabPanel value="ban">
					<BanForm />
				</TabPanel>

				<TabPanel value="unban">
					<Unban />
				</TabPanel>
			</TabPanels>
		</Tabs>
	</div>
</template>
