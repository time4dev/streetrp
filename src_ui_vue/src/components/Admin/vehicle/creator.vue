<script setup lang="ts">
	import { useForm, useField } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import vehiclesData from '@/data/vehicles.json';
import Select from '../partials/select.vue';	import Checkbox from '../partials/checkbox.vue';
	import Players from '../partials/players.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { model: '', player: '', temporary: false },
		validationSchema: yup.object({
			model: yup.string().required().min(1).max(1000)
		})
	});

	const { value: model } = useField<string>('model');

	async function createVehicle(data: any[]) {
		await rpc.callServer('Admin-CreateVehicle', data);
		showNotification('success', 'ТС успешно создано');
	}
</script>

<template>
	<form @submit="handleSubmit((values: any) => createVehicle(Object.values(values)))">
		<input
			v-model="model"
			class="admin_field"
			type="text"
			name="model"
			placeholder="Модель"
		/>

		<Select
			className="admin_select"
			className-prefix="admin_select"
			placeholder="Транспортное средство"
			:options="Object.entries(vehiclesData).map(([value, label]) => ({
				value,
				label
			}))"
			:no-options-message="() => 'Не найдено'"
			@change="(option: any) => setFieldValue('model', option?.value)"
		/>

		<Players :on-change="(data: any) => setFieldValue('player', data.dbId)" />

		<Checkbox name="temporary" label="Временное" />

		<GradientButton type="submit">Создать</GradientButton>
	</form>
</template>
