<script setup lang="ts">
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import Select from '../partials/select.vue';

	const classes = [
		{ value: 'low', label: 'Эконом' },
		{ value: 'average', label: 'Средний' },
		{ value: 'premium', label: 'Премиум' }
	];

	const { handleSubmit } = useForm({
		initialValues: { type: '' },
		validationSchema: yup.object({
			type: yup.string().required('Выберите класс дома')
		})
	});

	const { value: type, errorMessage: typeError } = useField<string>('type');

	const onSubmit = handleSubmit(async (values: any) => {
		await rpc.callServer('Admin-CreateHouse', values.type);

		showNotification('success', 'Дом построен');
	});
</script>

<template>
	<form class="admin__form" @submit="onSubmit">
		<div class="admin__field">
			<label class="admin__label">Класс дома</label>
			<Select v-model="type" :options="classes" :invalid="!!typeError" placeholder="Выберите класс" />
			<small v-if="typeError" class="admin__error">{{ typeError }}</small>
		</div>

		<div class="admin__actions">
			<Button type="submit" label="Создать" />
		</div>
	</form>
</template>
