<script setup lang="ts">
	import { useForm, useField } from 'vee-validate';
	import * as yup from 'yup';
	import { showNotification } from '@/utils/notifications';
	import rpc from '@/utils/rpc';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Players from '../partials/players.vue';
	import DatePicker from '../partials/date-picker.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { reason: '', term: '', player: '' },
		validationSchema: yup.object({
			reason: yup.string().min(1).max(1000),
			term: yup.date(),
			player: yup.string().required()
		})
	});

	const { value: reason } = useField<string>('reason');
	const { value: term } = useField<string>('term');

	async function setPlayerDemorgan(player: string, term?: string | null, reason?: string) {
		try {
			const isRelease = !term;

			await rpc.callServer(
				isRelease ? 'Admin-ReleaseDemorgan' : 'Admin-ToDemorgan',
				isRelease ? player : [player, term, reason]
			);

			showNotification(
				'success',
				isRelease ? 'Игрок освобожден' : 'Игрок заключен в деморган'
			);
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}

	const onSubmit = handleSubmit(({ player, term, reason }: any) =>
		setPlayerDemorgan(player, term, reason)
	);
</script>

<template>
	<div class="admin_demorgan">
		<form @submit="onSubmit">
			<input
				v-model="reason"
				class="admin_field"
				type="text"
				name="reason"
				placeholder="причина"
			/>

			<DatePicker name="term" placeholder="Срок" />
			<Players :on-change="(data: any) => setFieldValue('player', data.dbId)" />

			<GradientButton type="submit">
				{{ term ? 'Посадить' : 'Освободить' }}
			</GradientButton>
		</form>
	</div>
</template>
