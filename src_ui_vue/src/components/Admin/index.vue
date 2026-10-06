<script setup lang="ts">
	import { computed, markRaw, onMounted, ref, type Component } from 'vue';
	import Button from 'primevue/button';
	import Tag from 'primevue/tag';
	import rpc from '@/utils/rpc';
	import {
		IoAlbums,
		IoCar,
		IoIosClose,
		IoIosContact,
		IoIosEye,
		IoIosLock,
		IoIosPeople,
		IoIosPerson,
		IoIosSend,
		IoIosText,
		IoLibrary,
		IoNavigateOutline,
		IoServer,
		IoShield,
		IoWallet
	} from '@/utils/icons';

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
	import Licenses from './licenses/index.vue';

	type Tab = {
		name: string;
		component: Component;
		icon: Component;
	};

	const helperTabs: Tab[] = [
		{ name: 'Кик', component: markRaw(Kick), icon: markRaw(IoIosPerson) },
		{ name: 'Деморган', component: markRaw(Demorgan), icon: markRaw(IoIosLock) },
		{ name: 'Телепорт', component: markRaw(Teleport), icon: markRaw(IoNavigateOutline) },
		{ name: 'Репорты', component: markRaw(Reports), icon: markRaw(IoIosText) },
		{ name: 'Наблюдение', component: markRaw(Spectator), icon: markRaw(IoIosEye) }
	];

	const adminTabs: Tab[] = [
		{ name: 'Бан', component: markRaw(Ban), icon: markRaw(IoShield) },
		{ name: 'Транспорт', component: markRaw(Vehicle), icon: markRaw(IoCar) },
		{ name: 'Лицензии', component: markRaw(Licenses), icon: markRaw(IoLibrary) },
		{ name: 'Скин игрока', component: markRaw(Skin), icon: markRaw(IoIosContact) },
		{ name: 'Уведомления', component: markRaw(Chat), icon: markRaw(IoIosSend) }
	];

	const gmTabs: Tab[] = [
		{ name: 'Валюта', component: markRaw(Money), icon: markRaw(IoWallet) },
		{ name: 'Организации', component: markRaw(Faction), icon: markRaw(IoIosPeople) },
		{ name: 'Журнал действий', component: markRaw(Journal), icon: markRaw(IoServer) }
	];

	const ownerTabs: Tab[] = [
		{ name: 'Дома', component: markRaw(House), icon: markRaw(IoAlbums) }
	];

	const tabsByLevel = [
		helperTabs,
		[...helperTabs, ...adminTabs],
		[...helperTabs, ...adminTabs, ...gmTabs],
		[...helperTabs, ...adminTabs, ...gmTabs, ...ownerTabs]
	];

	const levelLabels = ['Helper', 'Admin', 'Game Master', 'Owner'];

	const level = ref(0);
	const active = ref('');

	const tabs = computed(() => tabsByLevel[level.value - 1] ?? []);
	const activeComponent = computed(
		() => tabs.value.find((tab) => tab.name === active.value)?.component
	);

	onMounted(() => {
		const state = history.state as { level?: number } | undefined;

		if (state?.level) level.value = state.level;
		active.value = tabs.value[0]?.name ?? '';
	});

	function close() {
		rpc.callClient('Browser-HidePage');
	}
</script>

<template>
	<div class="admin">
		<header class="admin__header">
			<div class="admin__title">
				<IoShield />

				<h2>Администрирование</h2>

				<Tag v-if="level" :value="levelLabels[level - 1]" severity="secondary" />
			</div>

			<Button severity="secondary" outlined @click="close">
				<IoIosClose />
				<span>Закрыть</span>
			</Button>
		</header>

		<div class="admin__body">
			<nav class="admin__nav">
				<Button
					v-for="tab in tabs"
					:key="tab.name"
					text
					class="admin__nav-item"
					:class="{ 'is-active': active === tab.name }"
					@click="active = tab.name"
				>
					<component :is="tab.icon" />
					<span>{{ tab.name }}</span>
				</Button>
			</nav>

			<main class="admin__content">
				<component :is="activeComponent" v-if="activeComponent" :key="active" />
			</main>
		</div>
	</div>
</template>
