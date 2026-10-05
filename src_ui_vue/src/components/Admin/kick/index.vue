<script setup lang="ts">
	import { useForm, useField } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Players from '../partials/players.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { reason: '', player: '' },
		validationSchema: yup.object({
			reason: yup.string().required().min(1).max(1000),
			player: yup.string().required()
		})
	});

	const { value: reason } = useField<string>('reason');

	async function kickPlayer(player: string, reason: string) {
		await rpc.callServer('Admin-Kick', [player, reason]);
		showNotification('success', 'Игрок кикнут');
	}

	const onSubmit = handleSubmit((values: any) => kickPlayer(values.player, values.reason));
</script>

<template>
	<div class="admin_kick">
		<form @submit="onSubmit">
			<input
				v-model="reason"
				class="admin_field"
				type="text"
				name="reason"
				placeholder="причина"
			/>

			<Players :on-change="(data: any) => setFieldValue('player', data.dbId)" />

			<GradientButton type="submit">Кикнуть</GradientButton>
		</form>
	</div>
</template>
