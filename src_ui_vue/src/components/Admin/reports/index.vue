<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import DataTable from 'primevue/datatable';
	import Column from 'primevue/column';
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import dayjs from '@/utils/dayjs';

	type Report = {
		_id: string;
		sender: string;
		message: string;
		timestamp: string;
	};

	const items = ref<Report[]>([]);
	const loading = ref(false);
	const hasMore = ref(true);

	let page = 0;

	async function fetchItems() {
		if (loading.value || !hasMore.value) return;

		loading.value = true;

		try {
			const data = (await rpc.callServer('Admin-GetReports', page)) as Report[];

			items.value = [...items.value, ...data];
			hasMore.value = data.length >= 20;
			page += 1;
		} finally {
			loading.value = false;
		}
	}

	async function acceptReport(id: string) {
		await rpc.callServer('Admin-AcceptReport', id);

		items.value = items.value.filter((item) => item._id !== id);
	}

	onMounted(fetchItems);
</script>

<template>
	<div class="admin__pane">
		<h3 class="admin__pane-title">Репорты</h3>
		<p class="admin__pane-hint">Обращения игроков к администрации</p>

		<DataTable
			:value="items"
			:loading="loading"
			data-key="_id"
			paginator
			:rows="8"
			:rows-per-page-options="[8, 16, 32]"
			class="admin__table"
		>
			<Column field="sender" header="Отправитель" style="width: 18%" />

			<Column field="message" header="Сообщение" body-class="admin__report-message" />

			<Column header="Время" style="width: 16%">
				<template #body="{ data }">
					<span class="admin__report-time">
						{{ dayjs(data.timestamp).format('DD.MM.YY, HH:mm') }}
					</span>
				</template>
			</Column>

			<Column header="" style="width: 10%">
				<template #body="{ data }">
					<Button
						text
						severity="success"
						label="Принять"
						@click="acceptReport(data._id)"
					/>
				</template>
			</Column>

			<template #empty>
				<div class="admin__empty">Активных репортов нет</div>
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
