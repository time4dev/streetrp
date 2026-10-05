<script setup lang="ts">
	import { useForm, useField } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import GradientButton from '@/components/Common/gradient-button.vue';

	const { handleSubmit } = useForm({
		initialValues: { govNumber: '' },
		validationSchema: yup.object({
			govNumber: yup.string()
		})
	});

	const { value: govNumber } = useField<string>('govNumber');

	async function despawnVehicle(govNumber?: string) {
		await rpc.callServer('Admin-DespawnVehicle', govNumber);
		showNotification('success', 'ТС успешно эвакуировано');
	}

	const onSubmit = handleSubmit((values: any) => despawnVehicle(values.govNumber));
</script>

<template>
	<form @submit="onSubmit">
		<input
			v-model="govNumber"
			class="admin_field"
			type="text"
			name="govNumber"
			placeholder="гос. номер"
		/>

		<GradientButton type="submit">Эвакуировать</GradientButton>
	</form>
</template>
