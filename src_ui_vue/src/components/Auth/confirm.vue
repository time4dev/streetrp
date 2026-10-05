<script setup lang="ts">
	import { useForm } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import Field from './field.vue';

	const props = defineProps<{
		email: string;
	}>();

	const { handleSubmit, setFieldError } = useForm({
		initialValues: { code: '' },
		validationSchema: yup.object({
			code: yup.string().required('Заполните поле')
		})
	});

	const onSubmit = handleSubmit((values: any) => {
		rpc
			.callServer('Auth-SignInWithCode', [props.email, values.code])
			.then(() => rpc.callClient('Auth-SuccessLogin', props.email))
			.catch(() => setFieldError('code', 'Неверный код'));
	});
</script>

<template>
	<div class="auth_confirm">
		<PrimaryTitle className="auth_title">Неизвестное устройство</PrimaryTitle>

		<p class="auth_confirm-remark">
			Попытка входа с неизвестного устройства.
			<br />
			Пожалуйста, подтвердите что это вы.
		</p>

		<form class="auth_form" @submit="onSubmit">
			<Field
				title="Код подтверждения"
				type="text"
				name="code"
				placeholder="Проверьте свой e-mail"
			/>

			<GradientButton type="submit">Подтвердить</GradientButton>
		</form>
	</div>
</template>
