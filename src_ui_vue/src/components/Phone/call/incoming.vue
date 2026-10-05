<script setup lang="ts">
	import { IoIosAlarm, IoIosText, IoIosCall } from '@/utils/icons';
	import Info from './info.vue';
	import Controls from './controls.vue';

	defineProps<{
		name: string;
		onControlClick: (control: string) => void;
	}>();

	const controls = [
		{
			name: 'remember',
			label: 'Напомнить',
			icon: IoIosAlarm
		},
		{
			name: 'message',
			label: 'Сообщение',
			icon: IoIosText
		},
		{
			name: 'decline',
			label: 'Отклонить',
			icon: IoIosCall
		},
		{
			name: 'accept',
			label: 'Ответить',
			icon: IoIosCall
		}
	];
</script>

<template>
	<div class="call_incoming">
		<Info status="сотовый" :name="name" />

		<Controls :items="controls" :on-click="onControlClick" />
	</div>
</template>
