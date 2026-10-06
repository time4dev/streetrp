<script setup lang="ts">
	import { ref } from 'vue';
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import InputText from 'primevue/inputtext';
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import vehiclesData from '@/data/vehicles.json';
	import Select from '../partials/select.vue';
	import Checkbox from '../partials/checkbox.vue';
	import Players from '../partials/players.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { model: '', player: '', temporary: false },
		validationSchema: yup.object({
			model: yup.string().required('Укажите модель').min(1).max(1000)
		})
	});

	const { value: model, errorMessage: modelError } = useField<string>('model');
	const { value: player } = useField<string>('player');

	const temporary = ref(false);

	const vehicleOptions = Object.entries(vehiclesData as Record<string, string>).map(
		([value, label]) => ({ value, label })
	);

	const onSubmit = handleSubmit(async () => {
		await rpc.callServer('Admin-CreateVehicle', [model.value, player.value, temporary.value]);

		showNotification('success', 'Транспорт создан');
	});
</script>

<template>
	<form class="admin__form" @submit="onSubmit">
		<div class="admin__field">
			<label class="admin__label">Модель</label>
			<InputText v-model="model" :invalid="!!modelError" placeholder="например: adder" />
			<small v-if="modelError" class="admin__error">{{ modelError }}</small>
		</div>

		<div class="admin__field">
			<label class="admin__label">Список транспорта</label>
			<Select
				v-model="model"
				:options="vehicleOptions"
				placeholder="Выберите из списка"
			/>
		</div>

		<div class="admin__field">
			<label class="admin__label">Владелец (для постоянного ТС)</label>
			<Players @select="(p: any) => setFieldValue('player', p?.dbId)" />
		</div>

		<Checkbox v-model="temporary" label="Временное транспортное средство" />

		<div class="admin__actions">
			<Button type="submit" label="Создать" />
		</div>
	</form>
</template>
