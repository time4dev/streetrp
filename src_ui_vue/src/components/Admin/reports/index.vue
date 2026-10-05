<script setup lang="ts">
	import { onBeforeUnmount, onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import Item from './item.vue';

	type Report = {
		_id: string;
		sender: string;
		message: string;
		timestamp: string;
	};

	const items = ref<Report[]>([]);
	const hasMore = ref(false);
	const listEl = ref<HTMLElement>();
	let page = 0;
	let loading = false;

	onMounted(() => {
		fetchItems(0);

		// react-infinite-scroller (useWindow=false) equivalent
		listEl.value?.addEventListener('scroll', onScroll);
	});

	onBeforeUnmount(() => {
		listEl.value?.removeEventListener('scroll', onScroll);
	});

	function onScroll() {
		const el = listEl.value;

		if (!el || !hasMore.value || loading) return;

		if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
			fetchItems(page);
		}
	}

	async function fetchItems(nextPage: number) {
		loading = true;

		const data: Report[] = await rpc.callServer('Admin-GetReports', nextPage);

		items.value = [...items.value, ...data];
		hasMore.value = data.length > 10;
		page = nextPage + 1;
		loading = false;
	}

	async function acceptReport(id: string) {
		await rpc.callServer('Admin-AcceptReport', id);

		items.value = items.value.filter((item) => item._id !== id);
	}
</script>

<template>
	<div class="admin_reports">
		<div ref="listEl" class="admin_reports-list">
			<Item
				v-for="item in items"
				:key="item._id"
				:sender="item.sender"
				:message="item.message"
				:time="item.timestamp"
				:on-accept="() => acceptReport(item._id)"
			/>
		</div>
	</div>
</template>
