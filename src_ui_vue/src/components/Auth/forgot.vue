<script setup lang="ts">
	import { trim } from 'lodash-es';
	import { useForm } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import Field from './field.vue';

	const props = defineProps<{
		toLogin: () => void;
	}>();

	const { handleSubmit, setFieldError, values, errors } = useForm({
		initialValues: {
			email: '',
			password: '',
			passwordConfirm: '',
			code: ''
		},
		validationSchema: yup.object({
			email: yup.string().email('Некорректный e-mail').required('Заполните поле'),
			password: yup
				.string()
				.min(4, 'Мин. длина 4 символа')
				.max(32, 'Макс. длина 32 символа')
				.required('Заполните поле'),
			passwordConfirm: yup
				.string()
				.required('Пароли не совпадают')
				.oneOf([yup.ref('password')], 'Пароли не совпадают'),
			code: yup.string().required('Заполните поле')
		})
	});

	const onSubmit = handleSubmit(async (formValues: any) => {
		const data = {
			email: trim(formValues.email).toLowerCase(),
			password: trim(formValues.password),
			code: trim(formValues.code)
		};

		try {
			await rpc.callServer('Auth-ResetPassword', data);

			props.toLogin();
		} catch (err: any) {
			setFieldError(err.field, err.message);
		}
	});

	function sendCode() {
		if (values.email && !errors.value.email) {
			rpc
				.callServer('Auth-GetResetCode', trim(values.email).toLowerCase())
				.then(() => showNotification('info', 'Проверьте ваш e-mail'))
				.catch(() => setFieldError('email', 'Аккаунт не найден'));
		}
	}
</script>

<template>
	<div class="auth_forgot auth_register">
		<PrimaryTitle className="auth_title">Восстановление пароля</PrimaryTitle>

		<form class="auth_form" @submit="onSubmit">
			<div class="auth_form-container">
				<Field title="E-mail" type="email" name="email" placeholder="streetrp@gta.com" />

				<GradientButton type="button" color="green" @click="sendCode">
					Отправить код
				</GradientButton>

				<div class="auth_form-group">
					<Field title="Новый пароль" type="password" name="password" placeholder="********" />
					<Field
						title="Подтверждение"
						type="password"
						name="passwordConfirm"
						placeholder="********"
					/>
				</div>

				<Field
					className="auth_form-part"
					title="Код подтверждения"
					type="text"
					name="code"
					placeholder="Проверьте свой e-mail"
				/>
			</div>

			<GradientButton type="submit">Подтвердить</GradientButton>
		</form>

		<OutlineButton className="auth_back-btn" @click="toLogin">Назад</OutlineButton>
	</div>
</template>
