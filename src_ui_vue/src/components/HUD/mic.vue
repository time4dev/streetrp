<script setup lang="ts">
	import { onBeforeUnmount, onMounted, ref } from 'vue';
	import { IoIosMic, IoIosMicOff } from '@/utils/icons';
	import rpc from '@/utils/rpc';
	import Key from './key.vue';

	defineProps<{
		bind: string;
	}>();

	const status = ref<boolean>(false);

	onMounted(() => {
		rpc.register('HUD-SetMicStatus', (value: boolean) => (status.value = value));
	});

	onBeforeUnmount(() => {
		rpc.unregister('HUD-SetMicStatus');
	});
</script>

<template>
	<div :class="['hud_mic', { active: status }]">
		<Key :pressed="status">{{ bind ?? 'Z' }}</Key>
		<IoIosMic v-if="status" />
		<IoIosMicOff v-else />
	</div>
</template>
