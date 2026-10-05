<script setup lang="ts">
	import { useForm } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import sounds from '@/utils/sounds';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Title from './partials/title.vue';
	import Field from './partials/field.vue';

	const props = defineProps<{
		comission: number;
	}>();

	const { handleSubmit, resetForm, values } = useForm({
		initialValues: { account: '', sum: '' },
		validationSchema: yup.object({
			account: yup
				.string()
				.trim()
				.required()
				.matches(/^[0-9]+$/)
				.min(6)
				.max(6),
			sum: yup.number().required().min(1).max(100000000)
		})
	});

	function getSumWithComission(sum: number) {
		return sum + Math.floor(sum / 100) * props.comission;
	}

	const onSubmit = handleSubmit(async (formValues) => {
		try {
			await rpc.callServer('Bank-Transfer', [formValues.account, formValues.sum]);

			resetForm();
			sounds.playPayment('bank');
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	});
</script>

<template>
	<div class="bank_tab">
		<form @submit="onSubmit">
			<Title>Перевод средств</Title>

			<div class="bank_fields">
				<Field
					type="string"
					name="account"
					placeholder="Банковский счет"
					label="Внимательно перепроверьте счет, перед отправкой"
				/>
				<Field
					type="number"
					name="sum"
					placeholder="Сумма перевода"
					:label="`Сумма с учетом комиссии составляет ${getSumWithComission(values.sum as any)}$`"
				/>
			</div>

			<GradientButton type="submit" color="purple">Подтвердить</GradientButton>
		</form>
	</div>
</template>
