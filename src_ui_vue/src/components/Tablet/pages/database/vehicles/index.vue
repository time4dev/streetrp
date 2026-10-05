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

	async function getVehicleData(govNumber: string) {
		const data = await rpc.callServer('GovInfo-GetVehicle', govNumber);

		router.navigate('/database/vehicle/', data);
	}

	const { handleSubmit, submitForm } = useForm({
		initialValues: { govNumber: '' },
		validationSchema: yup.object({
			govNumber: yup.string().required().min(1).max(8)
		})
	});

	const { value: govNumber } = useField<string>('govNumber');

	const onSubmit = handleSubmit((values: any) => getVehicleData(values.govNumber));
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="ТС" back-link="Назад" />
		</template>

		<form @submit="onSubmit">
			<F7List inset>
				<F7ListInput
					v-model="govNumber"
					clear-button
					name="govNumber"
					type="text"
					placeholder="Гос. номер"
				/>

				<F7ListButton title="Найти" @click="submitForm" />
			</F7List>
		</form>
	</F7Page>
</template>
