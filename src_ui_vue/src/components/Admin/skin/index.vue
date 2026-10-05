<script setup lang="ts">
	import { useForm, useField } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Players from '../partials/players.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { model: '', player: '' },
		validationSchema: yup.object({
			model: yup.string().required(),
			player: yup.string().required()
		})
	});

	const { value: model } = useField<string>('model');

	const onSubmit = handleSubmit(({ player, model }: any) =>
		rpc.callServer('Admin-ChangeSkin', [player, model])
	);
</script>

<template>
	<div class="admin_skin">
		<form @submit="onSubmit">
			<input
				v-model="model"
				class="admin_field"
				type="text"
				name="model"
				placeholder="модель"
			/>

			<Players :on-change="(data: any) => setFieldValue('player', data.dbId)" />

			<GradientButton type="submit">Сменить</GradientButton>
		</form>
	</div>
</template>
