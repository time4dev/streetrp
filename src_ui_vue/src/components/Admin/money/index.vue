<script setup lang="ts">
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import InputNumber from 'primevue/inputnumber';
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import Players from '../partials/players.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { sum: 0, player: '' },
		validationSchema: yup.object({
			sum: yup.number().required('Введите сумму').min(1).max(10000000),
			player: yup.string().required('Выберите игрока')
		})
	});

	const { value: sum, errorMessage: sumError } = useField<number>('sum');
	const { value: player, errorMessage: playerError } = useField<string>('player');

	async function giveMoney() {
		await rpc.callServer('Admin-ChangeMoney', [player.value, Number(sum.value)]);

		showNotification('success', 'Операция успешна');
	}

	const onSubmit = handleSubmit(giveMoney);
</script>

<template>
	<div class="admin__pane">
		<h3 class="admin__pane-title">Валюта</h3>
		<p class="admin__pane-hint">Начислить средства на банковский счёт игрока</p>

		<form class="admin__form" @submit="onSubmit">
			<div class="admin__field">
				<label class="admin__label">Игрок</label>
				<Players :invalid="!!playerError" @select="(p: any) => setFieldValue('player', p?.dbId)" />
				<small v-if="playerError" class="admin__error">{{ playerError }}</small>
			</div>

			<div class="admin__field">
				<label class="admin__label">Сумма</label>
				<InputNumber
					v-model="sum"
					:invalid="!!sumError"
					mode="currency"
					currency="USD"
					locale="en-US"
					:min="1"
					:max="10000000"
					show-buttons
				/>
				<small v-if="sumError" class="admin__error">{{ sumError }}</small>
			</div>

			<div class="admin__actions">
				<Button type="submit" label="Начислить" />
			</div>
		</form>
	</div>
</template>
