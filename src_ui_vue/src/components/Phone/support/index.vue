<script setup lang="ts">
	import { useForm } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import Input from '../partials/input.vue';
	import Group from '../partials/group.vue';
	import Button from '../partials/button.vue';
	import Description from '../partials/description.vue';

	const { handleSubmit, submitForm, resetForm } = useForm({
		initialValues: { message: '' },
		validationSchema: yup.object({
			message: yup.string().trim().required().min(2).max(64)
		})
	});

	const onSubmit = handleSubmit((values) => {
		rpc.callServer('Admin-SendReport', values.message).then(() => resetForm());
	});
</script>

<template>
	<div class="support">
		<form @submit="onSubmit">
			<Group>
				<Input type="text" name="message" placeholder="Сообщение" />

				<Button color="blue" :on-click="submitForm">Отправить</Button>
			</Group>

			<Description>Опишите коротко вашу проблему, макс. 64 символа.</Description>
		</form>
	</div>
</template>
