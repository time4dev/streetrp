<script setup lang="ts">
	import { useForm, useField } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import { useTabletRouter } from '@/composables/use-tablet-router';
	import F7Page from '../../../f7/page.vue';
	import F7Navbar from '../../../f7/navbar.vue';
	import F7List from '../../../f7/list.vue';
	import F7ListInput from '../../../f7/list-input.vue';
	import F7ListButton from '../../../f7/list-button.vue';

	const router = useTabletRouter();

	const props = defineProps<{
		userId: string;
	}>();

	async function writeTicket(sum: number, reason: string) {
		try {
			if (!props.userId) return;

			await rpc.callServer('Police-WriteTicket', [props.userId, { sum, reason }]);

			router.back();
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}

	const { handleSubmit, submitForm } = useForm({
		initialValues: { sum: '', reason: '' },
		validationSchema: yup.object({
			sum: yup.number().required().min(1).max(1000000),
			reason: yup.string().required().min(1).max(100)
		})
	});

	const { value: sum } = useField<string | number>('sum');
	const { value: reason } = useField<string>('reason');

	const onSubmit = handleSubmit((values: any) => writeTicket(+values.sum, values.reason));
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="Штраф" back-link="Назад" />
		</template>

		<form @submit="onSubmit">
			<F7List inset>
				<F7ListInput
					v-model="sum"
					clear-button
					name="sum"
					type="number"
					placeholder="Сумма"
					info="Максимальна сумма 12000$"
				/>

				<F7ListInput
					v-model="reason"
					clear-button
					name="reason"
					type="text"
					placeholder="Причина"
					info="Коротко опишите нарушение"
				/>
			</F7List>

			<F7List inset>
				<F7ListButton title="Выписать" @click="submitForm" />
			</F7List>
		</form>
	</F7Page>
</template>
