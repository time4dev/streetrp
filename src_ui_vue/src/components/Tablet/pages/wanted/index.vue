<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import F7Page from '../../f7/page.vue';
	import F7Navbar from '../../f7/navbar.vue';
	import F7List from '../../f7/list.vue';
	import F7ListItem from '../../f7/list-item.vue';

	type WantedItem = {
		id?: string;
		creator?: string;
		suspect: string;
		priority: number;
		reason: string;
		createdAt: string;
	};

	const items = ref<WantedItem[]>([]);
	const loading = ref(false);
	const hasMore = ref(true);

	onMounted(() => {
		loadMore();
	});

	async function loadMore() {
		if (loading.value || !hasMore.value) return;

		loading.value = true;

		const data: WantedItem[] = await rpc.callServer('WantedList-GetItems', items.value.length);

		items.value = [...items.value, ...data];
		hasMore.value = data.length >= 10;
		loading.value = false;
	}

	function removeItem(id: string) {
		items.value = items.value.filter((item) => item.id !== id);
	}
</script>

<template>
	<F7Page
		:infinite="hasMore"
		:infinite-preloader="loading"
		@infinite="loadMore"
	>
		<template #fixed>
			<F7Navbar title="Розыск" back-link="Назад" />
		</template>

		<F7List media-list inset>
			<F7ListItem
				v-for="(item, index) in items"
				:key="index"
				link="item/"
				:title="item.suspect"
				:text="item.reason"
				:badge="item.priority"
				:badge-color="item.priority < 3 ? 'gray' : item.priority >= 5 ? 'orange' : 'blue'"
				:route-props="{ data: item, onRemove: removeItem }"
			/>
		</F7List>
	</F7Page>
</template>
