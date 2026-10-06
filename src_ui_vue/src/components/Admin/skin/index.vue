<script setup lang="ts">
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import InputText from 'primevue/inputtext';
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import Players from '../partials/players.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { model: '', player: '' },
		validationSchema: yup.object({
			model: yup.string().required('Введите модель'),
			player: yup.string().required('Выберите игрока')
		})
	});

	const { value: model, errorMessage: modelError } = useField<string>('model');
	const { value: player, errorMessage: playerError } = useField<string>('player');

	async function changeSkin() {
		await rpc.callServer('Admin-ChangeSkin', [player.value, model.value]);
	}

	const onSubmit = handleSubmit(changeSkin);
</script>

<template>
	<div class="admin__pane">
		<h3 class="admin__pane-title">Скин игрока</h3>
		<p class="admin__pane-hint">Сменить модель персонажа (spawn-имя скина)</p>

		<form class="admin__form" @submit="onSubmit">
			<div class="admin__field">
				<label class="admin__label">Игрок</label>
				<Players :invalid="!!playerError" @select="(p: any) => setFieldValue('player', p?.dbId)" />
				<small v-if="playerError" class="admin__error">{{ playerError }}</small>
			</div>

			<div class="admin__field">
				<label class="admin__label">Модель</label>
				<InputText v-model="model" :invalid="!!modelError" placeholder="например: a_m_y_skater_01" />
				<small v-if="modelError" class="admin__error">{{ modelError }}</small>
			</div>

			<div class="admin__actions">
				<Button type="submit" label="Сменить" />
			</div>
		</form>
	</div>
</template>
