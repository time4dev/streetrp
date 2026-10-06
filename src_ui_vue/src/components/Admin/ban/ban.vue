<script setup lang="ts">
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import InputText from 'primevue/inputtext';
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import Players from '../partials/players.vue';
	import DatePicker from '../partials/date-picker.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { player: '', reason: '', term: '' },
		validationSchema: yup.object({
			player: yup.string().required('Выберите игрока'),
			reason: yup.string().required('Введите причину').min(1).max(1000),
			term: yup.string().required('Укажите срок')
		})
	});

	const { value: player, errorMessage: playerError } = useField<string>('player');
	const { value: reason, errorMessage: reasonError } = useField<string>('reason');
	const { value: term, errorMessage: termError } = useField<string>('term');

	async function banPlayer(values: any) {
		try {
			await rpc.callServer('Admin-Ban', [values.player, values.term, values.reason]);

			showNotification('success', 'Игрок забанен');
		} catch (err: any) {
			showNotification('error', err?.msg ?? 'Не удалось забанить игрока');
		}
	}

	const onSubmit = handleSubmit(banPlayer);
</script>

<template>
	<form class="admin__form" @submit="onSubmit">
		<div class="admin__field">
			<label class="admin__label">Игрок</label>
			<Players :invalid="!!playerError" @select="(p: any) => setFieldValue('player', p?.dbId)" />
			<small v-if="playerError" class="admin__error">{{ playerError }}</small>
		</div>

		<div class="admin__field">
			<label class="admin__label">Срок</label>
			<DatePicker v-model="term" :invalid="!!termError" placeholder="Дата окончания бана" />
			<small v-if="termError" class="admin__error">{{ termError }}</small>
		</div>

		<div class="admin__field">
			<label class="admin__label">Причина</label>
			<InputText v-model="reason" :invalid="!!reasonError" placeholder="причина" />
			<small v-if="reasonError" class="admin__error">{{ reasonError }}</small>
		</div>

		<div class="admin__actions">
			<Button type="submit" label="Забанить" severity="danger" />
		</div>
	</form>
</template>
