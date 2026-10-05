<script setup lang="ts">
	import { useForm, useField } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import GradientButton from '@/components/Common/gradient-button.vue';

	const { handleSubmit } = useForm({
		initialValues: { index: '' },
		validationSchema: yup.object({
			index: yup.number().required()
		})
	});

	const { value: index } = useField<number | string>('index');

	async function destroyHouse(index: number) {
		await rpc.callServer('Admin-DeleteHouse', index);
		showNotification('success', 'Дом успешно уничтожен');
	}

	const onSubmit = handleSubmit((values: any) => destroyHouse(+values.index));
</script>

<template>
	<form @submit="onSubmit">
		<input
			v-model="index"
			class="admin_field"
			type="number"
			name="index"
			placeholder="номер дома"
		/>

		<GradientButton type="submit">Снести</GradientButton>
	</form>
</template>
