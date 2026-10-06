<script setup lang="ts">
	import { ref } from 'vue';
	import Tabs from 'primevue/tabs';
	import TabList from 'primevue/tablist';
	import Tab from 'primevue/tab';
	import TabPanels from 'primevue/tabpanels';
	import TabPanel from 'primevue/tabpanel';
	import Leader from './leader.vue';
	import FortWar from './fort.vue';
	import GangZone from './gang-zone.vue';

	const active = ref('fort');
</script>

<template>
	<div class="admin__pane">
		<h3 class="admin__pane-title">Организации</h3>

		<Tabs v-model:value="active">
			<TabList>
				<Tab value="fort">Ивенты</Tab>
				<Tab value="zones">Территории банд</Tab>
				<Tab value="leader">Лидер</Tab>
			</TabList>

			<TabPanels>
				<TabPanel value="fort">
					<FortWar />
				</TabPanel>

				<TabPanel value="zones">
					<GangZone />
				</TabPanel>

				<TabPanel value="leader">
					<Leader />
				</TabPanel>
			</TabPanels>
		</Tabs>
	</div>
</template>
