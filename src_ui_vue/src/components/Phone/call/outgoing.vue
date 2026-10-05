<script setup lang="ts">
	import { IoIosMicOff, IoIosKeypad, IoIosAdd, IoIosPeople, IoIosCall } from '@/utils/icons';
	import Info from './info.vue';
	import Controls from './controls.vue';

	defineProps<{
		name: string;
		callTime?: string;
		isRecieveCall: boolean;
		onControlClick: (control: string) => void;
	}>();

	const controls = [
		{
			name: 'mic',
			label: 'Откл. звук',
			icon: IoIosMicOff
		},
		{
			name: 'keypad',
			label: 'Клавиши',
			icon: IoIosKeypad
		},
		{
			name: 'add',
			label: 'Добавить',
			icon: IoIosAdd
		},
		{
			name: 'contacts',
			label: 'Контакты',
			icon: IoIosPeople
		},
		{
			name: 'decline',
			label: 'Отклонить',
			icon: IoIosCall
		}
	];
</script>

<template>
	<div class="call_outgoing">
		<Info :name="name" :status="isRecieveCall ? 'идет разговор' : 'вызов на сотовый...'" />

		<Controls :items="controls" :on-click="onControlClick" />
	</div>
</template>
