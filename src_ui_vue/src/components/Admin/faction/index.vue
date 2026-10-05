<script setup lang="ts">
	import Tabs from '@/components/Common/rc-tabs.vue';
	import RcTabPane from '@/components/Common/rc-tab-pane.vue';
	import Leader from './leader.vue';
	import FortWar from './fort.vue';
	import GangZone from './gang-zone.vue';
</script>

<template>
	<div class="admin_faction">
		<Tabs prefix-cls="admin_tabs">
			<RcTabPane tab-key="fort" tab="Ивенты">
				<FortWar />
			</RcTabPane>

			<RcTabPane tab-key="zones" tab="Территории банд">
				<GangZone />
			</RcTabPane>

			<RcTabPane tab-key="leader" tab="Лидер">
				<Leader />
			</RcTabPane>
		</Tabs>
	</div>
</template>
