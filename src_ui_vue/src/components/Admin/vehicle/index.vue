<script setup lang="ts">
	import Tabs from '@/components/Common/rc-tabs.vue';
	import RcTabPane from '@/components/Common/rc-tab-pane.vue';
	import Creator from './creator.vue';
	import Despawn from './despawn.vue';
</script>

<template>
	<div class="admin_vehicle">
		<Tabs prefix-cls="admin_tabs">
			<RcTabPane tab-key="create" tab="Создать">
				<Creator />
			</RcTabPane>

			<RcTabPane tab-key="despawn" tab="Деспавн">
				<Despawn />
			</RcTabPane>
		</Tabs>
	</div>
</template>
