<script setup lang="ts">
	import { useForm, useField } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { useTabletRouter } from '@/composables/use-tablet-router';
	import F7Page from '../../f7/page.vue';
	import F7Navbar from '../../f7/navbar.vue';
	import F7List from '../../f7/list.vue';
	import F7ListInput from '../../f7/list-input.vue';
	import F7ListButton from '../../f7/list-button.vue';

	const router = useTabletRouter();

	const props = defineProps<{
		userId: string;
	}>();

	async function addItem(reason: string, priority: number) {
		await rpc.callServer('WantedList-AddItem', [props.userId, reason, priority]);

		router.back();
	}

	const { handleSubmit, submitForm } = useForm({
		initialValues: { reason: '', priority: '' },
		validationSchema: yup.object({
			reason: yup.string().required().min(2).max(32),
			priority: yup.number().required().min(1).max(5)
		})
	});

	const { value: reason } = useField<string>('reason');
	const { value: priority } = useField<string | number>('priority');

	const onSubmit = handleSubmit((values: any) => addItem(values.reason, +values.priority));
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="Ориентировка" back-link="Назад" />
		</template>

		<form @submit="onSubmit">
			<F7List inset>
				<F7ListInput
					v-model="reason"
					clear-button
					name="reason"
					type="text"
					placeholder="Описание"
					info="Опишите кратко нарушения гражданина"
				/>

				<F7ListInput
					v-model="priority"
					clear-button
					name="priority"
					type="number"
					placeholder="Приоритет"
					info="Укажите приоритет розыска от 1 до 5"
				/>
			</F7List>

			<F7List inset>
				<F7ListButton title="Составить" @click="submitForm" />
			</F7List>
		</form>
	</F7Page>
</template>
