<script setup lang="ts">
	import { computed, ref } from 'vue';
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import Button from 'primevue/button';
	import Tag from 'primevue/tag';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import dayjs from '@/utils/dayjs';
	import licensesData from '@/data/licenses.json';
	import Select from '../partials/select.vue';
	import Players from '../partials/players.vue';

	const titles = licensesData as Record<string, string>;

	const { validate, setFieldValue } = useForm({
		initialValues: { player: '', license: '' },
		validationSchema: yup.object({
			player: yup.string().required('Выберите игрока'),
			license: yup.string().required('Выберите лицензию')
		})
	});

	const { value: player, errorMessage: playerError } = useField<string>('player');
	const { value: license, errorMessage: licenseError } = useField<string>('license');

	const licenseOptions = Object.entries(titles).map(([value, label]) => ({ value, label }));
	const current = ref<{ [name: string]: string }>({});
	const busy = ref(false);

	const currentList = computed(() =>
		Object.entries(current.value).map(([name, expires]) => ({
			name,
			title: titles[name] ?? name,
			expires: dayjs(expires).format('DD.MM.YYYY')
		}))
	);

	async function selectPlayer(data: any) {
		setFieldValue('player', data?.dbId ?? '');
		current.value = {};

		if (data?.dbId) await refresh();
	}

	async function refresh() {
		if (!player.value) return;

		current.value = ((await rpc.callServer('Admin-GetPlayerLicenses', player.value)) ?? {}) as {
			[name: string]: string;
		};
	}

	async function run(kind: 'give' | 'withdraw') {
		const { valid } = await validate();

		if (!valid) return;

		busy.value = true;

		try {
			await rpc.callServer(
				kind === 'give' ? 'Admin-GiveLicense' : 'Admin-WithdrawLicense',
				[player.value, license.value]
			);

			showNotification('success', kind === 'give' ? 'Лицензия выдана' : 'Лицензия изъята');
			await refresh();
		} catch (err: any) {
			showNotification('error', err?.msg ?? 'Не удалось выполнить операцию');
		} finally {
			busy.value = false;
		}
	}
</script>

<template>
	<div class="admin__pane">
		<h3 class="admin__pane-title">Лицензии</h3>
		<p class="admin__pane-hint">Выдача и изъятие лицензий и медицинских справок</p>

		<div class="admin__form">
			<div class="admin__field">
				<label class="admin__label">Игрок</label>
				<Players :invalid="!!playerError" @select="selectPlayer" />
				<small v-if="playerError" class="admin__error">{{ playerError }}</small>
			</div>

			<div class="admin__field">
				<label class="admin__label">Лицензия</label>
				<Select
					v-model="license"
					:options="licenseOptions"
					:invalid="!!licenseError"
					placeholder="Выберите лицензию"
				/>
				<small v-if="licenseError" class="admin__error">{{ licenseError }}</small>
			</div>

			<div class="admin__actions">
				<Button
					label="Забрать"
					severity="danger"
					outlined
					:disabled="busy"
					@click="run('withdraw')"
				/>
				<Button label="Выдать" severity="success" :disabled="busy" @click="run('give')" />
			</div>
		</div>

		<div v-if="player" class="admin__licenses">
			<h4 class="admin__pane-title">Текущие лицензии</h4>

			<div v-if="currentList.length" class="admin__licenses-list">
				<Tag
					v-for="item in currentList"
					:key="item.name"
					:value="`${item.title} · до ${item.expires}`"
					severity="secondary"
				/>
			</div>

			<p v-else class="admin__pane-hint">У игрока нет действующих лицензий</p>
		</div>
	</div>
</template>
