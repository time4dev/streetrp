<script setup lang="ts">
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import Navigation from '../../partials/navigation.vue';
	import Button from '../../partials/button.vue';

	defineProps<{
		close: () => void;
	}>();

	async function reload() {
		await rpc.callClient('Voice-Reload');

		showNotification('info', 'Голосовой чат перезагружен');
	}
</script>

<template>
	<div class="settings_voice">
		<Navigation title="Голосовой чат" :close="{ title: '', onClick: close }" />

		<Button color="blue" :on-click="reload">Перезагрузить</Button>
	</div>
</template>
