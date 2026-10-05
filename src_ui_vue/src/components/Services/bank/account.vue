<script setup lang="ts">
	import { useForm } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Title from './partials/title.vue';
	import Field from './partials/field.vue';

	const props = defineProps<{
		price: number;
		setAccount: (account: string) => void;
	}>();

	const { handleSubmit } = useForm({
		initialValues: { account: '' },
		validationSchema: yup.object({
			account: yup
				.string()
				.trim()
				.required()
				.matches(/^[0-9]+$/)
				.min(6)
				.max(6)
		})
	});

	async function buy(account?: string) {
		try {
			const data = await rpc.callServer('Bank-CreateAccount', account);

			props.setAccount(data);
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}

	const onSubmit = handleSubmit((values) => buy(values.account));
</script>

<template>
	<div class="bank_tab">
		<form @submit="onSubmit">
			<Title>Открытие счета</Title>

			<Field
				type="text"
				name="account"
				placeholder="Желаемый номер (опционально)"
				:label="`Номер должен состоять из 6 цифр, его стоимость составляет ${price}$. Случайный номер бесплатный`"
			/>

			<div class="bank_tab-buttons">
				<GradientButton type="button" color="purple" @click="buy()">
					Случайный
				</GradientButton>

				<GradientButton type="submit" color="orange">Желаемый</GradientButton>
			</div>
		</form>
	</div>
</template>
