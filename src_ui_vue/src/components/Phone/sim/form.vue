<script setup lang="ts">
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import Button from './button.vue';

	const props = defineProps<{
		custom: boolean;
		submit: (value: string) => Promise<void>;
		close: () => void;
	}>();

	const { handleSubmit } = useForm({
		initialValues: { phone: '' },
		validationSchema: props.custom
			? yup.object({
					phone: yup
						.string()
						.trim()
						.required()
						.matches(/^[0-9]+$/)
						.min(6)
						.max(6)
				})
			: undefined
	});

	// legacy used a raw formik <Field> (plain input, not the custom Input partial)
	const { value: phone } = useField<string>('phone');

	const onSubmit = handleSubmit((values) => props.submit(values.phone));
</script>

<template>
	<form class="sim_form" @submit="onSubmit">
		<label class="sim_form-field">
			<input
				v-model="phone"
				type="text"
				name="phone"
				placeholder="XXX-XXX"
				:disabled="!custom"
			/>

			<span v-if="custom">Введите номер выше</span>
		</label>

		<Button type="submit">Купить</Button>
		<Button type="button" :on-click="close">Назад</Button>
	</form>
</template>
