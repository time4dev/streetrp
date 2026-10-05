<script setup lang="ts">
	import { useForm } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import factionsData from '@/data/factions.json';
	import Select from '../partials/select.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { faction: '' },
		validationSchema: yup.object({
			faction: yup.string().required()
		})
	});

	async function setOwner(faction: string) {
		try {
			await rpc.callServer('Admin-SetZoneOwner', faction);
			showNotification('success', 'Назначен новый владелец территории');
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}

	const onSubmit = handleSubmit(({ faction }: any) => setOwner(faction));
</script>

<template>
	<form @submit="onSubmit">
		<Select
			className="admin_select"
			className-prefix="admin_select"
			placeholder="Организация"
			:options="Object.entries(factionsData).map(([value, label]) => ({
				value,
				label
			}))"
			:no-options-message="() => 'Не найдено'"
			@change="(option: any) => setFieldValue('faction', option?.value)"
		/>

		<GradientButton type="submit">Назначить</GradientButton>
	</form>
</template>
