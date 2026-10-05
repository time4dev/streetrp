<script setup lang="ts">
	import { useForm } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Select from '../partials/select.vue';

	const classes = [
		{
			value: 'low',
			label: 'Эконом'
		},
		{
			value: 'average',
			label: 'Средний'
		},
		{
			value: 'premium',
			label: 'Премиум'
		}
	];

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { type: '' },
		validationSchema: yup.object({
			type: yup.string().required()
		})
	});

	async function createHouse(type: string) {
		await rpc.callServer('Admin-CreateHouse', type);
		showNotification('success', 'Дом успешно построен');
	}

	const onSubmit = handleSubmit((values: any) => createHouse(values.type));
</script>

<template>
	<form @submit="onSubmit">
		<Select
			className="admin_select"
			className-prefix="admin_select"
			placeholder="Класс дома"
			:options="classes"
			:no-options-message="() => 'Не найден'"
			@change="(option: any) => setFieldValue('type', option?.value)"
		/>

		<GradientButton type="submit">Создать</GradientButton>
	</form>
</template>
