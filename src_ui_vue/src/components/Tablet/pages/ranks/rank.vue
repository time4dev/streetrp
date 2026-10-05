<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import prettify from '@/utils/prettify';
	import type { Rank } from '@/stores/tablet';
	import { useTabletRouter } from '@/composables/use-tablet-router';
	import F7Page from '../../f7/page.vue';
	import F7Navbar from '../../f7/navbar.vue';
	import F7List from '../../f7/list.vue';
	import F7ListItem from '../../f7/list-item.vue';
	import F7Toggle from '../../f7/toggle.vue';
	import F7BlockHeader from '../../f7/block-header.vue';
	const props = defineProps<{
		rank: Rank;
	}>();

	const router = useTabletRouter();

	const permissionList: { [name: string]: string } = {
		garage: 'Гараж',
		inventory: 'Склад',
		workshop: 'Мастерская',
		warehouse: 'Доставка материалов',
		wanted: 'Розыск и арест',
		members: 'Управлять участниками'
	};

	const state = reactive({
		salary: 0,
		permissions: {} as { [name: string]: boolean },
		updated: false
	});

	onMounted(() => {
		getRankData();
	});

	async function getRankData() {
		const data = await rpc.callServer('Faction-GetRankData', props.rank.id);

		if ('salary' in data) state.salary = data.salary;
		if ('permissions' in data) state.permissions = data.permissions;
	}

	function togglePermission(name: string) {
		state.permissions = { ...state.permissions, [name]: !state.permissions[name] };
		state.updated = true;
	}

	async function updateRank() {
		if (state.updated) {
			await rpc.callServer('FactionLeader-EditRank', [props.rank.id, state.permissions]);
		}
	}

	async function onBack() {
		await updateRank();
	}
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar :title="rank.name" back-link="Назад" @back-click="onBack" />
		</template>

		<F7List inset>
			<F7ListItem title="Зарплата" :after="prettify.price(state.salary)" />
		</F7List>

		<F7BlockHeader>Права доступа:</F7BlockHeader>

		<F7List inset>
			<F7ListItem
				v-for="(access, name) in state.permissions"
				v-show="permissionList[String(name)]"
				:key="name"
				:title="permissionList[String(name)]"
			>
				<template #after>
					<F7Toggle
						color="green"
						:name="String(name)"
						:checked="access"
						@change="() => togglePermission(String(name))"
					/>
				</template>
			</F7ListItem>
		</F7List>
	</F7Page>
</template>
