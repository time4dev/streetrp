<script setup lang="ts">
	import images from '@/utils/images';

	defineProps<{
		type: 'house' | 'vehicle';
		items: { [name: string]: number };
	}>();
</script>

<template>
	<div class="trading_spec">
		<ul class="trading_spec-list">
			<li
				v-for="([name, value]) in Object.entries(items)"
				:key="name"
				class="trading_spec-item"
			>
				<img
					:src="images.getImage(`${name}.svg`, type === 'vehicle' ? 'lsc' : '')"
					:alt="name"
				/>

				<span>{{ type === 'vehicle' ? value + 1 : value }}</span>
			</li>
		</ul>
	</div>
</template>
