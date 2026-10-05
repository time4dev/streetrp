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
		message: string;
		createdAt: string;
	};

	const calls = ref<Call[]>([]);

	onMounted(() => {
		rpc.callServer('PoliceCalls-GetList').then((data: Call[]) => (calls.value = data));
	});

	async function markPosition(id: string) {
		try {
			await rpc.callServer('PoliceCalls-MarkPosition', id);
			showNotification('info', 'Местоположение отмечено на карте');
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
				v-for="(call, index) in [...calls].reverse()"
				:key="call.id"
				link="#"
				:title="`Вызов №${index + 1}`"
				:after="dayjs(call.createdAt).format('HH:mm')"
				:subtitle="call.message"
				@click="markPosition(call.id)"
			/>
		</F7List>
	</F7Page>
</template>
