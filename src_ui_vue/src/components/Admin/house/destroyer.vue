<script setup lang="ts">
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import InputNumber from 'primevue/inputnumber';
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';

	const { handleSubmit } = useForm({
		initialValues: { index: 0 },
		validationSchema: yup.object({
			index: yup.number().required('Укажите номер дома').min(1)
		})
	});

	const { value: index, errorMessage: indexError } = useField<number>('index');

	const onSubmit = handleSubmit(async (values: any) => {
		await rpc.callServer('Admin-DeleteHouse', Number(values.index));

		showNotification('success', 'Дом снесён');
	});
</script>

<template>
	<form class="admin__form" @submit="onSubmit">
		<div class="admin__field">
			<label class="admin__label">Номер дома</label>
			<InputNumber v-model="index" :invalid="!!indexError" :min="1" show-buttons />
			<small v-if="indexError" class="admin__error">{{ indexError }}</small>
		</div>

		<div class="admin__actions">
			<Button type="submit" label="Снести" severity="danger" />
		</div>
	</form>
</template>
