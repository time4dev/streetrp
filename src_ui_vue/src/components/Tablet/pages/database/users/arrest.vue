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

	async function submitArrest(term: number, reason: string) {
		try {
			if (!props.userId) return;

			await rpc.callServer('WantedList-Arrest', [props.userId, term, reason]);

			router.back();
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}

	const { handleSubmit, submitForm } = useForm({
		initialValues: { term: '', reason: '' },
		validationSchema: yup.object({
			term: yup.number().required().min(1).max(100),
			reason: yup.string().required().min(1).max(100)
		})
	});

	const { value: term } = useField<string | number>('term');
	const { value: reason } = useField<string>('reason');

	const onSubmit = handleSubmit((values: any) => submitArrest(+values.term, values.reason));
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="Арест" back-link="Назад" />
		</template>

		<form @submit="onSubmit">
			<F7List inset>
				<F7ListInput
					v-model="term"
					clear-button
					name="term"
					type="number"
					placeholder="Срок"
					info="Укажите время ареста от 1 до 100 минут"
				/>

				<F7ListInput
					v-model="reason"
					clear-button
					name="reason"
					type="text"
					placeholder="Причина"
					info="Коротко опишите причину"
				/>
			</F7List>

			<F7List inset>
				<F7ListButton title="Арестовать" @click="submitForm" />
			</F7List>
		</form>
	</F7Page>
</template>
