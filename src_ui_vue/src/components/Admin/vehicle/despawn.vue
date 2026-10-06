<script setup lang="ts">
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import InputText from 'primevue/inputtext';
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';

	const { handleSubmit } = useForm({
		initialValues: { govNumber: '' },
		validationSchema: yup.object({
			govNumber: yup.string()
		})
	});

	const { value: govNumber } = useField<string>('govNumber');

	const onSubmit = handleSubmit(async (values: any) => {
		await rpc.callServer('Admin-DespawnVehicle', values.govNumber);

		showNotification('success', 'Транспорт эвакуирован');
	});
</script>

<template>
	<form class="admin__form" @submit="onSubmit">
		<div class="admin__field">
			<label class="admin__label">Гос. номер</label>
			<InputText v-model="govNumber" placeholder="Оставьте пустым для ТС под прицелом" />
		</div>

		<div class="admin__actions">
			<Button type="submit" label="Эвакуировать" severity="danger" />
		</div>
	</form>
</template>
