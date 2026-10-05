<script setup lang="ts">
	import { useRoute, useRouter } from 'vue-router';
	import rpc from '@/utils/rpc';
	import Chat from '@/components/Chat/index.vue';
	import Toaster from '@/components/Common/toaster.vue';

	const route = useRoute();
	const router = useRouter();

	// Legacy behaviour (App.tsx): navigating to the same page remounts it via the '/' trick.
	rpc.register('Browser-ShowPage', (page: string, data: Record<string, unknown> = {}) => {
		const path = `/${page}`;

		if (route.path === path) router.push({ path: '/', state: {} });

		router.push({ path, state: data as any });
	});
</script>

<template>
	<RouterView v-slot="{ Component }">
		<component :is="Component" :key="route.path" />
	</RouterView>

	<Chat />

	<Toaster container="hud" />
	<Toaster container="menu" />
</template>
