<script setup lang="ts">
	import { onBeforeUnmount, onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import Item from './item.vue';

	type Report = {
		admin: string;
		action: string;
		note: string;
		createdAt: string;
	};

	const items = ref<Report[]>([]);
	const hasMore = ref(false);
	const listEl = ref<HTMLElement>();
	let page = 0;
let loading = false;

	onMounted(() => {
		fetchItems(0);

		// react-infinite-scroller (useWindow=false) equivalent: scroll on the list container
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

		const data: Report[] = await rpc.callServer('Admin-GetJournal', nextPage);

		items.value = [...items.value, ...data];
		hasMore.value = data.length > 10;
		page = nextPage + 1;
		loading = false;
	}
</script>

<template>
	<div class="admin_reports">
		<div ref="listEl" class="admin_reports-list">
			<Item
				v-for="(item, index) in items"
				:key="index"
				:admin="item.admin"
				:action="item.action"
				:message="item.note"
				:time="item.createdAt"
			/>
		</div>
	</div>
</template>
