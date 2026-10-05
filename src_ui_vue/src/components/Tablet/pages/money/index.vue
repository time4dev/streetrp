<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { useForm, useField } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import prettify from '@/utils/prettify';
	import F7Page from '../../f7/page.vue';
	import F7Navbar from '../../f7/navbar.vue';
	import F7List from '../../f7/list.vue';
	import F7ListItem from '../../f7/list-item.vue';
	import F7ListInput from '../../f7/list-input.vue';
	import F7ListButton from '../../f7/list-button.vue';
	import F7BlockHeader from '../../f7/block-header.vue';

	const balance = ref(0);

	onMounted(() => {
		rpc.callServer('Faction-GetMoney').then((amount: number) => (balance.value = amount));
	});

	function setCurrentBalance(amount: number) {
		balance.value = amount;
	}

	async function moneyOperation(type: 'add' | 'withdraw', amount: number) {
		const newBalance: number = await rpc.callServer('FactionLeader-ChangeMoney', [
			type,
			amount
		]);

		setCurrentBalance(newBalance);
	}

	const { handleSubmit, setFieldValue, submitForm } = useForm({
		initialValues: { sum: '', type: 'add' },
		validationSchema: yup.object({
			sum: yup.number().required().min(1).max(100000000)
		})
	});

	const { value: sum } = useField<string | number>('sum');
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="Баланс организации" />
		</template>

		<F7List inset>
			<F7ListItem title="Текущий баланс" :after="prettify.price(balance)" />
		</F7List>

		<F7BlockHeader>Финансовые операции</F7BlockHeader>

		<form @submit="handleSubmit((values: any) => moneyOperation(values.type as any, +values.sum))">
			<F7List inset>
				<F7ListInput
					v-model="sum"
					clear-button
					name="sum"
					type="number"
					placeholder="Сумма"
				/>
			</F7List>

			<F7List inset>
				<F7ListButton
					title="Пополнить"
					@click="
						() => {
							setFieldValue('type', 'add');
							submitForm();
						}
					"
				/>
				<F7ListButton
					title="Снять"
					color="red"
					@click="
						() => {
							setFieldValue('type', 'withdraw');
							submitForm();
						}
					"
				/>
			</F7List>
		</form>
	</F7Page>
</template>
