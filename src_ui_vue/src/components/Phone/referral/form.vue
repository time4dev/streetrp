<script setup lang="ts">
	import { useForm } from 'vee-validate';
	import * as yup from 'yup';
	import Group from '../partials/group.vue';
	import Input from '../partials/input.vue';
	import Button from '../partials/button.vue';
	import Description from '../partials/description.vue';

	const props = defineProps<{
		submit: (code: string) => void;
	}>();

	const { handleSubmit, submitForm } = useForm({
		initialValues: { code: '' },
		validationSchema: yup.object({
			code: yup.string().trim().required().min(2).max(32)
		})
	});

	const onSubmit = handleSubmit((values) => props.submit(values.code));
</script>

<template>
	<div class="referral_form">
		<form @submit.prevent="onSubmit">
			<Group>
				<Input type="text" name="code" placeholder="Промо-код" />
				<Button color="blue" :on-click="submitForm">Активировать</Button>
			</Group>

			<Description>Вы можете ввести один промокод и только один раз.</Description>
		</form>
	</div>
</template>
