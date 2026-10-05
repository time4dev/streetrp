<script setup lang="ts">
	import images from '@/utils/images';
	import apps from '../apps';

	defineProps<{
		openApp: (name: string) => void;
	}>();
</script>

<template>
	<div class="phone_dock">
		<ul class="phone_dock-list">
			<template v-for="(appData, key) in apps" :key="key">
				<li
					v-if="appData.attached"
					class="phone_dock-item"
					@click="openApp(String(key))"
				>
					<img :src="images.getImage(`${key}.svg`, 'phone')" :alt="String(key)" />
				</li>
			</template>
		</ul>
	</div>
</template>
