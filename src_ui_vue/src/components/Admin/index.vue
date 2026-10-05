<script setup lang="ts">
	import { onMounted, markRaw, ref, type Component } from 'vue';
	import Tabs from '@/components/Common/rc-tabs.vue';
	import RcTabPane from '@/components/Common/rc-tab-pane.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import Ban from './ban/index.vue';
	import Reports from './reports/index.vue';
	import Vehicle from './vehicle/index.vue';
	import Kick from './kick/index.vue';
	import Skin from './skin/index.vue';
	import Money from './money/index.vue';
	import Teleport from './teleport/index.vue';
	import Spectator from './spectator/index.vue';
	import Chat from './chat/index.vue';
	import House from './house/index.vue';
	import Demorgan from './demorgan/index.vue';
	import Faction from './faction/index.vue';
	import Journal from './journal/index.vue';

	type Tab = {
		name: string;
		component?: Component;
	};

	const helperTabs: Tab[] = [
		{ name: 'Кик', component: markRaw(Kick) },
		{ name: 'Деморган', component: markRaw(Demorgan) },
		{ name: 'Телепорт', component: markRaw(Teleport) },
		{ name: 'Репорты', component: markRaw(Reports) },
		{ name: 'Наблюдение', component: markRaw(Spectator) }
	];

	const adminTabs: Tab[] = [
		{ name: 'Бан', component: markRaw(Ban) },
		{ name: 'Транспорт', component: markRaw(Vehicle) },
		{ name: 'Скин игрока', component: markRaw(Skin) },
		{ name: 'Уведомления', component: markRaw(Chat) }
	];

	const gmTabs: Tab[] = [
		{ name: 'Валюта', component: markRaw(Money) },
		{ name: 'Организации', component: markRaw(Faction) },
		{ name: 'Журнал действий', component: markRaw(Journal) }
	];

	const ownerTabs: Tab[] = [{ name: 'Дома', component: markRaw(House) }];

	const tabsByLevel = [
		helperTabs,
		[...helperTabs, ...adminTabs],
		[...helperTabs, ...adminTabs, ...gmTabs],
		[...helperTabs, ...adminTabs, ...gmTabs, ...ownerTabs]
	];

	// legacy: componentDidMount -> setState(location.state) ({ level })
	const level = ref(0);

	onMounted(() => {
		const state = history.state as { level?: number } | undefined;

		if (state?.level) level.value = state.level;
	});
</script>

<template>
	<div class="admin">
		<Tabs
			prefix-cls="admin_tabs"
			tab-position="left"
			destroy-inactive-tab-pane
		>
			<template v-if="level">
				<RcTabPane
					v-for="(item, index) in tabsByLevel[level - 1] ?? []"
					:key="index"
					:tab-key="index"
					:tab="item.name"
					:disabled="!item.component"
				>
					<component :is="item.component" v-if="item.component" />
				</RcTabPane>
			</template>
		</Tabs>

		<OutlineButton className="admin_close-btn" is-close>Закрыть</OutlineButton>
	</div>
</template>
