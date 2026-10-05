<script setup lang="ts">
	import { useForm, useField } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Players from '../partials/players.vue';
	import DatePicker from '../partials/date-picker.vue';
	import Checkbox from '../partials/checkbox.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { reason: '', term: '', permanent: false, player: '' },
		validationSchema: yup.object({
			reason: yup.string().required().min(1).max(1000),
			term: yup.date().required(),
			player: yup.string().required()
		})
	});

	const { value: reason } = useField<string>('reason');

	async function banPlayer(reason: string, term: string, player: string) {
		try {
			await rpc.callServer('Admin-Ban', [player, term, reason]);

			showNotification('success', 'Игрок забанен!');
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}

	const onSubmit = handleSubmit((values: any) =>
		banPlayer(values.reason, values.term, values.player)
	);
</script>

<template>
	<form @submit="onSubmit">
		<input
			v-model="reason"
			class="admin_field"
			type="text"
			name="reason"
			placeholder="Причина"
		/>

		<DatePicker name="term" placeholder="Срок" />
		<Players :on-change="(data: any) => setFieldValue('player', data.dbId)" />

		<Checkbox name="permanent" label="Навсегда" />

		<GradientButton type="submit">Забанить</GradientButton>
	</form>
</template>
