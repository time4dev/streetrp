<script setup lang="ts">
	import { capitalize, trim } from 'lodash-es';
	import { useForm } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import Field from './field.vue';

	const props = defineProps<{
		setEmail: (email: string) => void;
		toLogin: () => void;
	}>();

	const { handleSubmit, setFieldError, values, errors } = useForm({
		initialValues: {
			firstName: '',
			lastName: '',
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
			firstName: yup
				.string()
				.matches(/^[a-z\s]+$/i, 'Только латиница')
				.max(32, 'Макс. длина 32 символа')
				.required('Заполните поле'),
			lastName: yup
				.string()
				.matches(/^[a-z\s]+$/i, 'Только латиница')
				.max(32, 'Макс. длина 32 символа')
				.required('Заполните поле'),
			code: yup.string().required('Заполните поле')
		})
	});

	const onSubmit = handleSubmit(async (formValues: any) => {
		const data = {
			email: trim(formValues.email).toLowerCase(),
			password: trim(formValues.password),
			firstName: capitalize(trim(formValues.firstName)),
			lastName: capitalize(trim(formValues.lastName)),
			code: trim(formValues.code)
		};

		try {
			await rpc.callServer('Auth-SignUp', data);
			await rpc.callClient('Auth-SuccessRegister', data.email);

			props.setEmail(data.email);
			props.toLogin();
		} catch (err: any) {
			setFieldError(err.field, err.message);
		}
	});

	function sendCode() {
		if (values.email && !errors.value.email) {
			rpc
				.callServer('Auth-GetRegisterCode', trim(values.email).toLowerCase())
				.then(() => showNotification('info', 'Проверьте ваш e-mail'))
				.catch(() => setFieldError('email', 'E-mail занят'));
		}
	}
</script>

<template>
	<div class="auth_register">
		<PrimaryTitle className="auth_title">Регистрация</PrimaryTitle>

		<form class="auth_form" @submit="onSubmit">
			<div class="auth_form-container">
				<div class="auth_form-group">
					<Field title="Имя" type="text" name="firstName" placeholder="John" />
					<Field title="Фамилия" type="text" name="lastName" placeholder="Doe" />
				</div>

				<Field title="E-mail" type="email" name="email" placeholder="streetrp@gta.com" />

				<GradientButton type="button" color="green" @click="sendCode">
					Отправить код
				</GradientButton>

				<div class="auth_form-group">
					<Field title="Пароль" type="password" name="password" placeholder="********" />
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

			<GradientButton type="submit">Создать</GradientButton>
		</form>

		<OutlineButton className="auth_back-btn" @click="toLogin">Назад</OutlineButton>
	</div>
</template>
