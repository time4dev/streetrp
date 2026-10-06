<script setup lang="ts">
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import Players from '../partials/players.vue';

	const { handleSubmit } = useForm({
		initialValues: { player: '' },
		validationSchema: yup.object({
			player: yup.string().required('Выберите игрока')
		})
	});

	const { value: player, errorMessage: playerError } = useField<string>('player');

	const onSubmit = handleSubmit(() => {
		rpc.callServer('Admin-Spectate', Number(player.value));
	});
</script>

<template>
	<div class="admin__pane">
		<h3 class="admin__pane-title">Наблюдение</h3>
		<p class="admin__pane-hint">Перейти в режим наблюдения за выбранным игроком</p>

		<form class="admin__form" @submit="onSubmit">
			<div class="admin__field">
				<label class="admin__label">Игрок</label>
				<Players :invalid="!!playerError" @select="(p: any) => (player = p?.id ?? '')" />
				<small v-if="playerError" class="admin__error">{{ playerError }}</small>
			</div>

			<div class="admin__actions">
				<Button type="submit" label="Наблюдать" />
			</div>
		</form>
	</div>
</template>
