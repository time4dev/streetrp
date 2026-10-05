<script setup lang="ts">
	import { useForm } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Players from '../partials/players.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { player: '' },
		validationSchema: yup.object({
			player: yup.number()
		})
	});

	const onSubmit = handleSubmit(({ player }: any) => rpc.callServer('Admin-Spectate', player));
</script>

<template>
	<div class="admin_spectator">
		<form @submit="onSubmit">
			<Players :on-change="(data: any) => setFieldValue('player', data.id)" />

			<GradientButton type="submit">Наблюдать</GradientButton>
		</form>
	</div>
</template>
