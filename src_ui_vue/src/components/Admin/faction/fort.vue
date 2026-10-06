<script setup lang="ts">
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';

	async function startWar() {
		await rpc.callServer('Admin-StartFortWar');

		showNotification('success', 'Ивент активирован');
	}
</script>

<template>
	<div class="admin__form">
		<p class="admin__pane-hint">Запустить ивент «Нападение на ФЗ»</p>

		<div class="admin__actions">
			<Button label="Начать «Нападение на ФЗ»" severity="warn" @click="startWar" />
		</div>
	</div>
</template>
