<script setup lang="ts">
	import { useForm } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import sounds from '@/utils/sounds';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Title from './partials/title.vue';
	import Field from './partials/field.vue';

	const { handleSubmit, resetForm } = useForm({
		initialValues: { sum: '' },
		validationSchema: yup.object({
			sum: yup.number().required().min(1).max(100000000)
		})
	});

	const onSubmit = handleSubmit(async (values) => {
		try {
			await rpc.callServer('Bank-Replenish', values.sum);

			resetForm();
			sounds.playPayment('cash');
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	});
</script>

<template>
	<div class="bank_tab">
		<form @submit="onSubmit">
			<Title>Пополнение баланса</Title>

			<Field type="number" name="sum" placeholder="Сумма пополнения" />

			<GradientButton type="submit" color="purple">Подтвердить</GradientButton>
		</form>
	</div>
</template>
