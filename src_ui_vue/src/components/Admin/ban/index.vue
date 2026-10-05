<script setup lang="ts">
	import Tabs from '@/components/Common/rc-tabs.vue';
	import RcTabPane from '@/components/Common/rc-tab-pane.vue';
	import BanForm from './ban.vue';
	import Unban from './unban.vue';
</script>

<template>
	<div class="admin_ban">
		<Tabs prefix-cls="admin_tabs">
			<RcTabPane tab-key="ban" tab="Бан">
				<BanForm />
			</RcTabPane>

			<RcTabPane tab-key="unban" tab="Разбан">
				<Unban />
			</RcTabPane>
		</Tabs>
	</div>
</template>
