<script setup lang="ts">
	import { computed } from 'vue';
	import { storeToRefs } from 'pinia';
	import { useTabletMembersStore } from '@/stores/tablet';
	import F7Page from '../../f7/page.vue';
	import F7Navbar from '../../f7/navbar.vue';
	import F7List from '../../f7/list.vue';
	import F7ListItem from '../../f7/list-item.vue';

	const membersStore = useTabletMembersStore();
	const { items: members } = storeToRefs(membersStore);

	const loading = computed(() => loadingRef.value);
	const loadingRef = ref(false);
	const hasMore = ref(true);

	onMounted(() => {
		if (members.value.length) return;

		getMembers();
	});

	async function getMembers() {
		if (loadingRef.value || !hasMore.value) return;

		loadingRef.value = true;

		const data = await import('@/utils/rpc').then(({ default: rpc }) =>
			rpc.callServer('Faction-GetMembers', members.value.length)
		);

		membersStore.loadMembers(data);
		loadingRef.value = false;
		hasMore.value = data.length >= 15;
	}

	import { onMounted, ref } from 'vue';
</script>

<template>
	<F7Page
		:infinite="hasMore"
		:infinite-preloader="loading"
		@infinite="getMembers"
	>
		<template #fixed>
			<F7Navbar title="Состав" />
		</template>

		<F7List inset>
			<F7ListItem
				v-for="item in members"
				:key="item.userId"
				link="member/"
				:title="item.name"
				:after="item.online ? 'Онлайн' : ''"
				:route-props="{ member: item }"
			/>
		</F7List>
	</F7Page>
</template>
