<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import dayjs from '@/utils/dayjs';
	import inventoryItems from '@/data/inventory.json';
	import F7Page from '../../f7/page.vue';
	import F7Navbar from '../../f7/navbar.vue';
	import F7List from '../../f7/list.vue';
	import F7ListItem from '../../f7/list-item.vue';

	const actions: { [name: string]: string } = {
		craft: 'Крафт',
		put: 'Положил',
		took: 'Взял'
	};

	type JournalItem = {
		member: string;
		action: string;
		amount: number;
		thing: string;
		createdAt: string;
	};

	const items = ref<JournalItem[]>([]);
	const loading = ref(false);
	const hasMore = ref(true);

	onMounted(() => {
		loadMore();
	});

	async function loadMore() {
		if (loading.value || !hasMore.value) return;

		loading.value = true;

		const data: JournalItem[] = await rpc.callServer('FactionJournal-GetList', items.value.length);

		items.value = [...items.value, ...data];
		hasMore.value = data.length >= 10;
		loading.value = false;
	}
</script>

<template>
	<F7Page
		:infinite="hasMore"
		:infinite-preloader="loading"
		@infinite="loadMore"
	>
		<template #fixed>
			<F7Navbar title="Журнал действий" />
		</template>

		<F7List media-list inset>
			<F7ListItem
				v-for="(item, index) in items"
				:key="index"
				:title="item.member"
				:after="actions[item.action]"
				:subtitle="`${(inventoryItems as any)[item.thing]?.name ?? item.thing} - ${item.amount}`"
				:text="dayjs(item.createdAt).format('DD.MM.YY, HH:mm')"
			/>
		</F7List>
	</F7Page>
</template>
