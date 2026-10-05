<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { useForm, useField } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import factionsData from '@/data/factions.json';
	import F7Page from '../../f7/page.vue';
	import F7Navbar from '../../f7/navbar.vue';
	import F7List from '../../f7/list.vue';
	import F7ListItem from '../../f7/list-item.vue';
	import F7ListInput from '../../f7/list-input.vue';
	import F7ListButton from '../../f7/list-button.vue';
	import F7BlockHeader from '../../f7/block-header.vue';

	const materials = ref<{ [faction: string]: number }>({});

	onMounted(() => {
		rpc.callServer('Faction-GetMaterials').then((data: any) => (materials.value = data));
	});

	async function createOrder(forArmy: boolean, amount: number) {
		try {
			await rpc.callServer('Factions-OrderMaterials', [forArmy, amount]);

			showNotification('success', 'Вы сделали заказ материалов');
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}

	const { handleSubmit, setFieldValue, submitForm } = useForm({
		initialValues: { army: false, amount: '' },
		validationSchema: yup.object({
			amount: yup.number().required().min(1).max(100000000)
		})
	});

	const { value: amount } = useField<string | number>('amount');
	const { value: army } = useField<boolean>('army');
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="Материалы" />
		</template>

		<F7BlockHeader>Баланс организаций</F7BlockHeader>

		<F7List inset>
			<F7ListItem
				v-for="(amountValue, name) in materials"
				:key="name"
				:title="(factionsData as any)[String(name)]"
				:after="String(amountValue)"
			/>
		</F7List>

		<F7BlockHeader>Поставка</F7BlockHeader>

		<form @submit="handleSubmit((values: any) => createOrder(values.army, +values.amount))">
			<F7List inset>
				<F7ListInput
					v-model="amount"
					clear-button
					name="amount"
					type="number"
					placeholder="Кол-во матов"
				/>

				<F7ListItem
					checkbox
					name="army"
					title="Армия"
					:checked="army"
					@change="(checked: boolean) => setFieldValue('army', checked)"
				/>

				<F7ListButton title="Заказать" @click="submitForm" />
			</F7List>
		</form>
	</F7Page>
</template>
