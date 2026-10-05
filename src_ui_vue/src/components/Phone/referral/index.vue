<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import Group from '../partials/group.vue';
	import Button from '../partials/button.vue';
	import Description from '../partials/description.vue';
	import Form from './form.vue';

	const code = ref('NONE');
	const income = ref(0);
	const bonus = ref(0);
	const referrals = ref({
		total: 0,
		confirmed: 0
	});
	const confirmLevel = ref(0);

	onMounted(() => {
		rpc.callServer('Referral-GetInfo').then((data: any) => {
			if ('code' in data) code.value = data.code;
			if ('income' in data) income.value = data.income;
			if ('bonus' in data) bonus.value = data.bonus;
			if ('referrals' in data) referrals.value = data.referrals;
			if ('confirmLevel' in data) confirmLevel.value = data.confirmLevel;
		});
	});

	async function useCode(code: string) {
		try {
			await rpc.callServer('Referral-UseCode', code);

			showNotification('success', 'Промокод успешно активирован');
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}
</script>

<template>
	<div class="referral">
		<Group className="referral_info">
			<Button :current="code">Код</Button>
			<Button :current="referrals.total.toString()">Ввели</Button>
			<Button :current="referrals.confirmed.toString()">Получили бонус</Button>
		</Group>

		<Description>
			После достижения {{ confirmLevel }}го уровня игрока, он получит {{ bonus }}$, а вы
			{{ income }}$.
		</Description>

		<Form :submit="useCode" />
	</div>
</template>
