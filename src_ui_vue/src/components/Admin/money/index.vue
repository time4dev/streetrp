<script setup lang="ts">
	import { useForm, useField } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Players from '../partials/players.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { sum: '', player: '' },
		validationSchema: yup.object({
			sum: yup.number().required().min(1).max(10000000),
			player: yup.string().required()
		})
	});

	const { value: sum } = useField<number | string>('sum');

	async function giveMoney(player: string, amount: number) {
		await rpc.callServer('Admin-ChangeMoney', [player, amount]);
		showNotification('success', 'Операция успешна');
	}

	const onSubmit = handleSubmit((values: any) => giveMoney(values.player, +values.sum));
</script>

<template>
	<div class="admin_money">
		<form @submit="onSubmit">
			<input
				v-model="sum"
				class="admin_field"
				type="number"
				name="sum"
				placeholder="Сумма"
			/>

			<Players :on-change="(data: any) => setFieldValue('player', data.dbId)" />

			<GradientButton type="submit">Начислить</GradientButton>
		</form>
	</div>
</template>
