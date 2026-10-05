<script setup lang="ts">
	import { ref, watch } from 'vue';
	import rpc from '@/utils/rpc';
	import images from '@/utils/images';

	const props = defineProps<{
		weapon: string;
	}>();

	const clipSize = ref(0);

	watch(
		() => props.weapon,
		(weapon) => {
			rpc
				.callClient('Weapons-GetClipSize', `weapon_${weapon}`)
				.then((data) => (clipSize.value = data));
		},
		{ immediate: true }
	);
</script>

<template>
	<div class="weapons_preview">
		<img :src="images.getImage(`${weapon}.png`, 'inventory')" :alt="weapon" />

		<div class="weapons_preview-ammo">
			<h4 class="title">Патрон в магазине</h4>

			<span class="value">{{ clipSize }}</span>
		</div>
	</div>
</template>
