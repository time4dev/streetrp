<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { useForm } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import sounds from '@/utils/sounds';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Title from './partials/title.vue';
	import Field from './partials/field.vue';

	const price = ref(0);

	const { handleSubmit, resetForm, values } = useForm({
		initialValues: { days: '' },
		validationSchema: yup.object({
			days: yup.number().required().min(1).max(1000)
		})
	});

	async function getPrice() {
		price.value = await rpc.callServer('Business-GetTax');
	}

	onMounted(() => {
		getPrice();
	});

	const onSubmit = handleSubmit(async (formValues) => {
		try {
			await rpc.callServer('Bank-PayBusiness', [formValues.days]);

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
			<Title>Оплата бизнеса</Title>

			<Field
				type="number"
				name="days"
				placeholder="Количество дней"
				:label="`Сумма к оплате ${+values.days * price}$`"
			/>

			<GradientButton type="submit" color="purple">Подтвердить</GradientButton>
		</form>
	</div>
</template>
