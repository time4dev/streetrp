<script setup lang="ts">
	import { useForm } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import factionsData from '@/data/factions.json';
	import Select from '../partials/select.vue';
	import Players from '../partials/players.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { faction: '', player: '' },
		validationSchema: yup.object({
			faction: yup.string().required(),
			player: yup.string().required()
		})
	});

	async function setLeader(player: string, faction: string) {
		try {
			await rpc.callServer('Admin-SetFactionLeader', [player, faction]);
			showNotification('success', 'Игрок назначен лидером организации');
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}

	const onSubmit = handleSubmit(({ faction, player }: any) => setLeader(player, faction));
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

		<Players :on-change="(data: any) => setFieldValue('player', data.dbId)" />

		<GradientButton type="submit">Назначить</GradientButton>
	</form>
</template>
