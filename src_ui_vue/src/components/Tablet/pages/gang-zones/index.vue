<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import prettify from '@/utils/prettify';
	import F7Page from '../../f7/page.vue';
	import F7Navbar from '../../f7/navbar.vue';
	import F7List from '../../f7/list.vue';
	import F7ListItem from '../../f7/list-item.vue';
	import F7ListButton from '../../f7/list-button.vue';
	import F7BlockHeader from '../../f7/block-header.vue';
	import F7BlockFooter from '../../f7/block-footer.vue';

	const zones = ref(0);
	const income = ref(0);

	onMounted(() => {
		rpc.callServer('GangZones-GetInfo').then((data: any) => {
			if ('zones' in data) zones.value = data.zones;
			if ('income' in data) income.value = data.income;
		});
	});

	async function startWar() {
		try {
			await rpc.callServer('ZoneCapture-StartWar');
			showNotification('success', 'Вы начали войну за территорию');
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="Территории" />
		</template>

		<F7BlockHeader>Ваши территории</F7BlockHeader>

		<F7List inset>
			<F7ListItem title="Под контролем" :after="zones.toString()" />
			<F7ListItem title="Доходность в час" :after="prettify.price(income)" />
		</F7List>

		<F7BlockHeader>Захват</F7BlockHeader>

		<F7List inset>
			<F7ListButton title="Начать захват" @click="startWar" />
		</F7List>

		<F7BlockFooter>Отметьте территорию на карте, чтобы начать захват</F7BlockFooter>
	</F7Page>
</template>
