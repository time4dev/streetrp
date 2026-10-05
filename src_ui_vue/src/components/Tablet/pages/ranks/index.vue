<script setup lang="ts">
	import { onBeforeMount, watchEffect } from 'vue';
	import { storeToRefs } from 'pinia';
	import rpc from '@/utils/rpc';
	import { useTabletRanksStore, type Rank } from '@/stores/tablet';
	import F7Page from '../../f7/page.vue';
	import F7Navbar from '../../f7/navbar.vue';
	import F7List from '../../f7/list.vue';
	import F7ListItem from '../../f7/list-item.vue';

	const ranksStore = useTabletRanksStore();
	const { items: ranks } = storeToRefs(ranksStore);

	// legacy: useEffect without deps (guarded)
	watchEffect(() => {
		getRanks();
	});

	onBeforeMount(() => {
		// nothing extra: getRanks is invoked by the watcher above
	});

	async function getRanks() {
		if (ranks.value.length) return;

		const items: Rank[] = await rpc.callServer('Faction-GetRanks');
		ranksStore.loadRanks(items);
	}
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="Ранги" />
		</template>

		<F7List inset>
			<F7ListItem
				v-for="rank in ranks"
				:key="rank.id"
				link="rank/"
				:title="rank.name"
				:route-props="{ rank }"
			/>
		</F7List>
	</F7Page>
</template>
