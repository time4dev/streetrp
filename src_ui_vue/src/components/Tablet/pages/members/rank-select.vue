<script setup lang="ts">
	import { onMounted, ref, watchEffect } from 'vue';
	import { storeToRefs } from 'pinia';
	import rpc from '@/utils/rpc';
	import { useTabletRanksStore, type Rank } from '@/stores/tablet';
	import F7Page from '../../f7/page.vue';
	import F7Navbar from '../../f7/navbar.vue';
	import F7List from '../../f7/list.vue';
	import F7ListItem from '../../f7/list-item.vue';

	const ranksStore = useTabletRanksStore();
	const { items: ranks } = storeToRefs(ranksStore);

	const props = defineProps<{
		selected: string;
		onSelect: (rank: Rank) => void;
	}>();

	const rank = ref<Rank | undefined>(undefined);

	// legacy: useEffect without deps -> getRanks on every render (guarded by ranks.length)
	watchEffect(() => {
		getRanks();
	});

	async function getRanks() {
		if (ranks.value.length) return;

		const items: Rank[] = await rpc.callServer('Faction-GetRanks');
		ranksStore.loadRanks(items);
	}

	function onBack() {
		if (rank.value) props.onSelect(rank.value);
	}

	function onRadioClick(item: Rank) {
		rank.value = item;
	}
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="Ранг" back-link="Назад" @back-click="onBack" />
		</template>

		<F7List inset>
			<F7ListItem
				v-for="item in ranks"
				:key="item.id"
				radio
				:name="'rank-select'"
				:title="item.name"
				:checked="item.name === (rank ? rank.name : props.selected)"
				@click="onRadioClick(item)"
			/>
		</F7List>
	</F7Page>
</template>
