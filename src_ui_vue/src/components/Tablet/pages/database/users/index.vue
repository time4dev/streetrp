<script setup lang="ts">
	import { useForm, useField } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { useTabletRouter } from '@/composables/use-tablet-router';
	import F7Page from '../../../f7/page.vue';
	import F7Navbar from '../../../f7/navbar.vue';
	import F7List from '../../../f7/list.vue';
	import F7ListInput from '../../../f7/list-input.vue';
	import F7ListButton from '../../../f7/list-button.vue';

	const router = useTabletRouter();

	async function getUserData(firstName: string, lastName: string) {
		const name = `${firstName}_${lastName}`;
		const data = await rpc.callServer('GovInfo-GetUser', name);

		router.navigate('/database/user/', data);
	}

	const { handleSubmit, submitForm } = useForm({
		initialValues: { firstName: '', lastName: '' },
		validationSchema: yup.object({
			firstName: yup.string().required().min(2).max(32),
			lastName: yup.string().required().min(2).max(32)
		})
	});

	const { value: firstName } = useField<string>('firstName');
	const { value: lastName } = useField<string>('lastName');

	const onSubmit = handleSubmit((values: any) => getUserData(values.firstName, values.lastName));
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="Граждани" back-link="Назад" />
		</template>

		<form @submit="onSubmit">
			<F7List inset>
				<F7ListInput
					v-model="firstName"
					clear-button
					name="firstName"
					type="text"
					placeholder="Имя"
				/>

				<F7ListInput
					v-model="lastName"
					clear-button
					name="lastName"
					type="text"
					placeholder="Фамилия"
				/>

				<F7ListButton title="Найти" @click="submitForm" />
			</F7List>
		</form>
	</F7Page>
</template>
