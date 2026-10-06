<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import DataTable from 'primevue/datatable';
	import Column from 'primevue/column';
	import Button from 'primevue/button';
	import Tag from 'primevue/tag';
	import rpc from '@/utils/rpc';
	import dayjs from '@/utils/dayjs';

	type Entry = {
		admin: string;
		action: string;
		note: string;
		createdAt: string;
	};

	const actions: { [name: string]: string } = {
		ban: 'Бан',
		unban: 'Разбан',
		kick: 'Кик',
		demorgan: 'Деморган',
		prison_release: 'Освобождение',
		house_add: 'Дом +',
		house_delete: 'Дом -',
		vehicle_create: 'ТС +',
		money: 'Валюта',
		skin: 'Скин',
		notify: 'Уведомление',
		license: 'Лицензия +',
		license_withdraw: 'Лицензия -'
	};

	const severityByAction: { [name: string]: string } = {
		ban: 'danger',
		kick: 'danger',
		demorgan: 'danger',
		house_delete: 'danger',
		unban: 'success',
		prison_release: 'success',
		house_add: 'success',
		vehicle_create: 'success',
		license: 'success',
		license_withdraw: 'danger',
		money: 'info',
		skin: 'info',
		notify: 'secondary'
	};

	const items = ref<Entry[]>([]);
	const loading = ref(false);
	const hasMore = ref(true);

	let page = 0;

	async function fetchItems() {
		if (loading.value || !hasMore.value) return;

		loading.value = true;

		try {
			const data = (await rpc.callServer('Admin-GetJournal', page)) as Entry[];

			items.value = [...items.value, ...data];
			hasMore.value = data.length >= 20;
			page += 1;
		} finally {
			loading.value = false;
		}
	}

	onMounted(fetchItems);
</script>

<template>
	<div class="admin__pane">
		<h3 class="admin__pane-title">Журнал действий</h3>
		<p class="admin__pane-hint">История административных действий</p>

		<DataTable
			:value="items"
			:loading="loading"
			paginator
			:rows="10"
			:rows-per-page-options="[10, 20, 50]"
			class="admin__table"
		>
			<Column field="admin" header="Администратор" style="width: 20%" />

			<Column header="Действие" style="width: 16%">
				<template #body="{ data }">
					<Tag
						:value="actions[data.action] ?? data.action"
						:severity="(severityByAction[data.action] ?? 'secondary') as any"
					/>
				</template>
			</Column>

			<Column field="note" header="Заметка" body-class="admin__report-message" />

			<Column header="Время" style="width: 16%">
				<template #body="{ data }">
					<span class="admin__report-time">
						{{ dayjs(data.createdAt).format('DD.MM.YY, HH:mm') }}
					</span>
				</template>
			</Column>

			<template #empty>
				<div class="admin__empty">Записей нет</div>
			</template>

			<template #footer>
				<div v-if="hasMore" class="admin__actions">
					<Button
						text
						label="Загрузить ещё"
						:loading="loading"
						@click="fetchItems"
					/>
				</div>
			</template>
		</DataTable>
	</div>
</template>
