<script setup lang="ts">
	import { useForm, useField } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import GradientButton from '@/components/Common/gradient-button.vue';

	const { handleSubmit } = useForm({
		initialValues: { message: '' },
		validationSchema: yup.object({
			message: yup.string().required().min(4).max(1000)
		})
	});

	const { value: message } = useField<string>('message');

	const onSubmit = handleSubmit((values: any) =>
		rpc.callServer('Admin-SendToChat', values.message)
	);
</script>

<template>
	<div class="admin_chat">
		<form @submit="onSubmit">
			<input
				v-model="message"
				class="admin_field"
				type="text"
				name="message"
				placeholder="сообщение в чат"
			/>

			<GradientButton type="submit">Отправить</GradientButton>
		</form>
	</div>
</template>
