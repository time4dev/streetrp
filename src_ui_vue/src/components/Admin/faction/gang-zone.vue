<script setup lang="ts">
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import factionsData from '@/data/factions.json';
	import Select from '../partials/select.vue';

	const { handleSubmit } = useForm({
		initialValues: { faction: '' },
		validationSchema: yup.object({
			faction: yup.string().required('Выберите организацию')
		})
	});

	const { value: faction, errorMessage: factionError } = useField<string>('faction');

	const factionOptions = Object.entries(factionsData as Record<string, string>).map(
		([value, label]) => ({ value, label })
	);

	const onSubmit = handleSubmit(async (values: any) => {
		await rpc.callServer('Admin-SetZoneOwner', values.faction);

		showNotification('success', 'Назначен новый владелец территории');
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

		<div class="admin__actions">
			<Button type="submit" label="Назначить" />
		</div>
	</form>
</template>
