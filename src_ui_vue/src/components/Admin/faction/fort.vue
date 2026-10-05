<script setup lang="ts">
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import GradientButton from '@/components/Common/gradient-button.vue';

	async function startWar() {
		await rpc.callServer('Admin-StartFortWar');
		showNotification('success', 'Вы активировали ивент');
	}
</script>

<template>
	<div class="admin_tab-container">
		<GradientButton type="submit" @click="startWar">
			Начать "Нападение на ФЗ"
		</GradientButton>
	</div>
</template>
