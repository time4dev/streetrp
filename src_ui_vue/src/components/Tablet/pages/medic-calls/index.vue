<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import dayjs from '@/utils/dayjs';
	import F7Page from '../../f7/page.vue';
	import F7Navbar from '../../f7/navbar.vue';
	import F7List from '../../f7/list.vue';
	import F7ListItem from '../../f7/list-item.vue';

	export type Call = {
		id: string;
		victim: string;
		dist: number;
		createdAt: string;
	};

	const calls = ref<Call[]>([]);

	onMounted(() => {
		rpc.callServer('EmsCalls-GetList').then((data: Call[]) => (calls.value = data));
	});

	async function acceptCall(id: string) {
		try {
			await rpc.callServer('EmsCalls-Accept', id);

			calls.value = calls.value.filter((item) => item.id !== id);
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="Вызовы" />
		</template>

		<F7List media-list inset>
			<F7ListItem
				v-for="call in calls"
				:key="call.id"
				checkbox
				:title="call.victim"
				:footer="`${Math.floor(call.dist)} метров`"
				:after="dayjs(call.createdAt).format('HH:mm')"
				@change="acceptCall(call.id)"
			/>
		</F7List>
	</F7Page>
</template>
