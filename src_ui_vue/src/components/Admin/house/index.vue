<script setup lang="ts">
	import Tabs from '@/components/Common/rc-tabs.vue';
	import RcTabPane from '@/components/Common/rc-tab-pane.vue';
	import Creator from './creator.vue';
	import Destroyer from './destroyer.vue';
</script>

<template>
	<div class="admin_house">
		<Tabs prefix-cls="admin_tabs">
			<RcTabPane tab-key="create" tab="Создать">
				<Creator />
			</RcTabPane>

			<RcTabPane tab-key="delete" tab="Удалить">
				<Destroyer />
			</RcTabPane>
		</Tabs>
	</div>
</template>
