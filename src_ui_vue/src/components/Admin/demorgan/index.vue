<script setup lang="ts">
	import { ref } from 'vue';
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import InputText from 'primevue/inputtext';
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import Players from '../partials/players.vue';
	import DatePicker from '../partials/date-picker.vue';
	import Checkbox from '../partials/checkbox.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { player: '', reason: '', term: '' },
		validationSchema: yup.object({
			player: yup.string().required('Выберите игрока')
		})
	});

	const { value: player, errorMessage: playerError } = useField<string>('player');
	const { value: reason } = useField<string>('reason');
	const { value: term } = useField<string>('term');

	const isRelease = ref(false);

	const onSubmit = handleSubmit(async () => {
		if (isRelease.value) {
			await rpc.callServer('Admin-ReleaseDemorgan', player.value);

			showNotification('success', 'Игрок освобождён');
			return;
		}

		if (!term.value) {
			showNotification('error', 'Укажите срок заключения');
			return;
		}

		await rpc.callServer('Admin-ToDemorgan', [player.value, term.value, reason.value]);

		showNotification('success', 'Игрок заключён в деморган');
	});
</script>

<template>
	<div class="admin__pane">
		<h3 class="admin__pane-title">Деморган</h3>
		<p class="admin__pane-hint">Поместить игрока в деморган или освободить его</p>

		<form class="admin__form" @submit="onSubmit">
			<div class="admin__field">
				<label class="admin__label">Игрок</label>
				<Players :invalid="!!playerError" @select="(p: any) => setFieldValue('player', p?.dbId)" />
				<small v-if="playerError" class="admin__error">{{ playerError }}</small>
			</div>

			<Checkbox v-model="isRelease" label="Освободить игрока" />

			<template v-if="!isRelease">
				<div class="admin__field">
					<label class="admin__label">Срок</label>
					<DatePicker v-model="term" placeholder="Дата и время освобождения" />
				</div>

				<div class="admin__field">
					<label class="admin__label">Причина</label>
					<InputText v-model="reason" placeholder="причина" />
				</div>
			</template>

			<div class="admin__actions">
				<Button
					type="submit"
					:label="isRelease ? 'Освободить' : 'Посадить'"
					:severity="isRelease ? 'success' : 'danger'"
				/>
			</div>
		</form>
	</div>
</template>
