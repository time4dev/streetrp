<script setup lang="ts">
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import InputText from 'primevue/inputtext';
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';

	const { handleSubmit } = useForm({
		initialValues: { email: '' },
		validationSchema: yup.object({
			email: yup.string().required('Введите e-mail').email('Некорректный e-mail')
		})
	});

	const { value: email, errorMessage: emailError } = useField<string>('email');

	async function unbanPlayer(values: any) {
		try {
			await rpc.callServer('Admin-Unban', values.email);

			showNotification('success', 'Игрок разбанен');
		} catch (err: any) {
			showNotification('error', err?.msg ?? 'Не удалось разбанить игрока');
		}
	}

	const onSubmit = handleSubmit(unbanPlayer);
</script>

<template>
	<form class="admin__form" @submit="onSubmit">
		<div class="admin__field">
			<label class="admin__label">E-mail игрока</label>
			<InputText v-model="email" :invalid="!!emailError" placeholder="user@mail.com" />
			<small v-if="emailError" class="admin__error">{{ emailError }}</small>
		</div>

		<div class="admin__actions">
			<Button type="submit" label="Разбанить" severity="success" />
		</div>
	</form>
</template>
