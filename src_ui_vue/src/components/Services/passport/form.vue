<script setup lang="ts">
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';

	const props = defineProps<{
		submit: (firstName: string, lastName: string) => void;
	}>();

	const validationSchema = yup.object({
		firstName: yup.string()
			.matches(/^[a-z\s]+$/i, 'Только латиница')
			.max(32, 'Макс. длина 32 символа')
			.required('Заполните поле'),
		lastName: yup.string()
			.matches(/^[a-z\s]+$/i, 'Только латиница')
			.max(32, 'Макс. длина 32 символа')
			.required('Заполните поле')
	});

	const { handleSubmit } = useForm({
		validationSchema,
		initialValues: {
			firstName: '',
			lastName: ''
		}
	});

	// Formik <Field> + <ErrorMessage> equivalent
	const { value: firstName, errorMessage: firstNameError } = useField<string>('firstName');
	const { value: lastName, errorMessage: lastNameError } = useField<string>('lastName');

	const onSubmit = handleSubmit((values) => props.submit(values.firstName, values.lastName));
</script>

<template>
	<form class="passport_form" id="passport" @submit="onSubmit">
		<div class="passport_form-field">
			<input v-model="firstName" type="text" name="firstName" placeholder="Имя" />
			<p v-if="firstNameError" class="passport_form-error">{{ firstNameError }}</p>
		</div>

		<div class="passport_form-field">
			<input v-model="lastName" type="text" name="lastName" placeholder="Фамилия" />
			<p v-if="lastNameError" class="passport_form-error">{{ lastNameError }}</p>
		</div>
	</form>
</template>
