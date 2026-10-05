<script setup lang="ts">
	import dayjs from '@/utils/dayjs';

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
		notify: 'Уведомление'
	};

	defineProps<{
		admin: string;
		action: string;
		message: string;
		time: string;
	}>();
</script>

<template>
	<div class="admin_reports-item">
		<span class="admin_reports-sender">{{ admin }}</span>
		<p class="admin_reports-message">{{ message }}</p>

		<span class="admin_reports-time">
			<strong>{{ actions[action] }} | </strong> {{ dayjs(time).format('DD.MM.YY, HH:mm') }}
		</span>
	</div>
</template>
