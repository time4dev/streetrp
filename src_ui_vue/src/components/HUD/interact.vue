<script setup lang="ts">
	import { onBeforeUnmount, onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';

	const key = ref<string>();

	onMounted(() => {
		rpc.register('HUD-ShowInteract', (data: string) => (key.value = data));
	});

	onBeforeUnmount(() => {
		rpc.unregister('HUD-ShowInteract');
	});
</script>

<template>
	<div v-if="key" class="hud_interact">
		<span class="hud_interact-key">{{ key }}</span>

		<span class="hud_interact-action">Взаимодействие</span>
	</div>
</template>
