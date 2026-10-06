<script setup lang="ts">
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import factionsData from '@/data/factions.json';
	import Select from '../partials/select.vue';
	import Players from '../partials/players.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { faction: '', player: '' },
		validationSchema: yup.object({
			faction: yup.string().required('Выберите организацию'),
			player: yup.string().required('Выберите игрока')
		})
	});

	const { value: faction, errorMessage: factionError } = useField<string>('faction');
	const { value: player, errorMessage: playerError } = useField<string>('player');

	const factionOptions = Object.entries(factionsData as Record<string, string>).map(
		([value, label]) => ({ value, label })
	);

	const onSubmit = handleSubmit(async (values: any) => {
		try {
			await rpc.callServer('Admin-SetFactionLeader', [values.player, values.faction]);

			showNotification('success', 'Игрок назначен лидером организации');
		} catch (err: any) {
			showNotification('error', err?.msg ?? 'Не удалось назначить лидера');
		}
	});
</script>

<template>
	<form class="admin__form" @submit="onSubmit">
		<div class="admin__field">
			<label class="admin__label">Организация</label>
			<Select
				v-model="faction"
				:options="factionOptions"
				:invalid="!!factionError"
				placeholder="Выберите организацию"
			/>
			<small v-if="factionError" class="admin__error">{{ factionError }}</small>
		</div>

		<div class="admin__field">
			<label class="admin__label">Игрок</label>
			<Players :invalid="!!playerError" @select="(p: any) => setFieldValue('player', p?.dbId)" />
			<small v-if="playerError" class="admin__error">{{ playerError }}</small>
		</div>

		<div class="admin__actions">
			<Button type="submit" label="Назначить" />
		</div>
	</form>
</template>
