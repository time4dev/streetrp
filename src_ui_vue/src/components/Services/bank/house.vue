<script setup lang="ts">
	import { ref } from 'vue';
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
		initialValues: { number: '', days: '' },
		validationSchema: yup.object({
			number: yup.number().required().min(0).max(100000),
			days: yup.number().required().min(1).max(1000)
		})
	});

	async function getPrice(house: number) {
		price.value = await rpc.callServer('House-GetTax', house);
	}

	function onNumberBlur(event: FocusEvent) {
		getPrice(+(event.target as HTMLInputElement).value);
	}

	const onSubmit = handleSubmit(async (formValues) => {
		try {
			await rpc.callServer('Bank-PayHouse', [formValues.number, formValues.days]);

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
			<Title>Оплата дома</Title>

			<div class="bank_fields">
				<Field
					type="number"
					name="number"
					placeholder="Номер дома"
					label="Номер можно узнать в меню дома"
					@blur="onNumberBlur"
				/>
				<Field
					type="number"
					name="days"
					placeholder="Количество дней"
					:label="`Сумма к оплате ${+values.days * price}$`"
				/>
			</div>

			<GradientButton type="submit" color="purple">Подтвердить</GradientButton>
		</form>
	</div>
</template>
