<script setup lang="ts">
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import InputText from 'primevue/inputtext';
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import Players from '../partials/players.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { player: '', reason: '' },
		validationSchema: yup.object({
			player: yup.string().required('Выберите игрока'),
			reason: yup.string().required('Введите причину').min(1).max(1000)
		})
	});

	const { value: reason, errorMessage: reasonError } = useField<string>('reason');
	const { value: player, errorMessage: playerError } = useField<string>('player');

	async function kickPlayer() {
		await rpc.callServer('Admin-Kick', [player.value, reason.value]);

		showNotification('success', 'Игрок кикнут');
	}

	const onSubmit = handleSubmit(kickPlayer);
</script>

<template>
	<div class="admin__pane">
		<h3 class="admin__pane-title">Кик игрока</h3>
		<p class="admin__pane-hint">Принудительно отключить игрока от сервера</p>

		<form class="admin__form" @submit="onSubmit">
			<div class="admin__field">
				<label class="admin__label">Игрок</label>
				<Players :invalid="!!playerError" @select="(p: any) => setFieldValue('player', p?.dbId)" />
				<small v-if="playerError" class="admin__error">{{ playerError }}</small>
			</div>

			<div class="admin__field">
				<label class="admin__label">Причина</label>
				<InputText v-model="reason" :invalid="!!reasonError" placeholder="причина" />
				<small v-if="reasonError" class="admin__error">{{ reasonError }}</small>
			</div>

			<div class="admin__actions">
				<Button type="submit" label="Кикнуть" severity="danger" />
			</div>
		</form>
	</div>
</template>
