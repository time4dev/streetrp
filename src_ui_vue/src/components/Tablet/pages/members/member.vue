<script setup lang="ts">
	import rpc from '@/utils/rpc';
	import { useTabletMembersStore, type Member } from '@/stores/tablet';
	import { useTabletRouter } from '@/composables/use-tablet-router';
	import F7Page from '../../f7/page.vue';
	import F7Navbar from '../../f7/navbar.vue';
	import F7List from '../../f7/list.vue';
	import F7ListItem from '../../f7/list-item.vue';
	import F7ListButton from '../../f7/list-button.vue';

	const membersStore = useTabletMembersStore();
	const router = useTabletRouter();

	const props = defineProps<{
		member: Member;
	}>();

	async function setRank(rank: { id: string; name: string } | undefined | null) {
		const { member } = props;

		if (!rank || member.rank === rank.name) return;

		await rpc.callServer('FactionLeader-SetRank', [member.userId, rank.id]);
		membersStore.updateMember({ ...member, rank: rank.name });
		member.rank = rank.name;
	}

	async function kick() {
		const userId = props.member.userId;

		await rpc.callServer('FactionLeader-Kick', userId);
		membersStore.removeMember(userId);

		router.back();
	}
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="Участник" back-link="Назад" />
		</template>

		<F7List inset>
			<F7ListItem title="Имя" :after="member.name" />
			<F7ListItem
				link="rank/"
				title="Ранг"
				:after="member.rank"
				:route-props="{ selected: member.rank, onSelect: setRank }"
			/>
		</F7List>

		<F7List inset>
			<F7ListButton title="Уволить" color="red" @click="kick" />
		</F7List>
	</F7Page>
</template>
