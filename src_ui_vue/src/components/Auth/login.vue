<script setup lang="ts">
	import { useForm } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { loadCredentials, saveCredentials } from '@/utils/auth-storage';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import Field from './field.vue';

	const props = defineProps<{
		setEmail: (email: string) => void;
		openForm: (name: string) => void;
		email?: string;
	}>();

	const saved = loadCredentials();

	const { handleSubmit, setFieldError } = useForm({
		initialValues: {
			email: props.email || saved?.email || '',
			password: saved?.password || ''
		},
		validationSchema: yup.object({
			email: yup.string().email('Некорректный e-mail').required('Заполните поле'),
			password: yup.string().required('Заполните поле')
		})
	});

	const onSubmit = handleSubmit((values: any) => {
		rpc
			.callServer('Auth-SignIn', Object.values(values))
			.then(() => {
				saveCredentials(values.email, values.password);
				return rpc.callClient('Auth-SuccessLogin', values.email);
			})
			.catch((err: any) => {
				if (err.confirm) {
					saveCredentials(values.email, values.password);
					props.setEmail(values.email);
					return props.openForm('confirm');
				}

				setFieldError(err.field, err.message);
			});
	});
</script>

<template>
	<div class="auth_login">
		<PrimaryTitle>Авторизация</PrimaryTitle>

		<div class="auth_login-container">
			<form class="auth_form" @submit="onSubmit">
				<Field title="Введите e-mail" type="email" name="email" placeholder="streetrp@gta.com" />
				<Field title="Ваш пароль" type="password" name="password" placeholder="********" />

				<a class="auth_login-forgot" @click="openForm('forgot')">Забыли пароль?</a>

				<GradientButton type="submit">Войти</GradientButton>
			</form>

			<div class="auth_login-promo">
				<h3 class="title">Нет аккаунта?</h3>

				<button class="create-button" @click="openForm('register')">Жми сюда</button>

				<p class="descr">И создай его сейчас</p>
			</div>
		</div>
	</div>
</template>
