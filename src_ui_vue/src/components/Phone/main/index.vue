<script setup lang="ts">
	import { inject, ref } from 'vue';
	import images from '@/utils/images';
	import { PHONE_CONTEXT } from '../context';
	import apps from '../apps';
	import Pagination from './pagination.vue';
	import Dock from './dock.vue';

	const phoneContext = inject(PHONE_CONTEXT)!;
	const page = ref<number>(0);
</script>

<template>
	<div class="phone_main">
		<ul class="phone_main-apps">
			<template v-for="(appData, key) in apps" :key="key">
				<li v-if="!appData.attached" @click="phoneContext.openApp(String(key))">
					<img :src="images.getImage(`${key}.svg`, 'phone')" :alt="String(key)" />
					<span class="name">{{ appData.name }}</span>
				</li>
			</template>
		</ul>

		<Pagination :pages="1" :current="page" :select-page="(index: number) => (page = index)" />

		<Dock :open-app="phoneContext.openApp" />
	</div>
</template>
