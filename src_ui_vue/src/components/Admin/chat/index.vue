<script setup lang="ts">
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import Textarea from 'primevue/textarea';
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';

	const { handleSubmit } = useForm({
		initialValues: { message: '' },
		validationSchema: yup.object({
			message: yup.string().required('Введите сообщение').min(4).max(1000)
		})
	});

	const { value: message, errorMessage: messageError } = useField<string>('message');

	const onSubmit = handleSubmit(async (values: any) => {
		await rpc.callServer('Admin-SendToChat', values.message);

		showNotification('success', 'Сообщение отправлено');
	});
</script>

<template>
	<div class="admin__pane">
		<h3 class="admin__pane-title">Уведомление в чат</h3>
		<p class="admin__pane-hint">Отправить системное сообщение всем игрокам сервера</p>

		<form class="admin__form" @submit="onSubmit">
			<div class="admin__field">
				<label class="admin__label">Сообщение</label>
				<Textarea
					v-model="message"
					:invalid="!!messageError"
					rows="4"
					auto-resize
					placeholder="Текст сообщения"
				/>
				<small v-if="messageError" class="admin__error">{{ messageError }}</small>
			</div>

			<div class="admin__actions">
				<Button type="submit" label="Отправить" />
			</div>
		</form>
	</div>
</template>
