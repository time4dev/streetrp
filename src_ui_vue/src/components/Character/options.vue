<script setup lang="ts">
	import images from '@/utils/images';

	defineProps<{
		items: {
			[name: string]: string;
		};
		selected: string;
		select: (name: string) => void;
	}>();
</script>

<template>
	<div class="character_options">
		<ul class="character_options-list">
			<li
				v-for="(title, name) in items"
				:key="name"
				:class="['character_options-item', { active: name === selected }]"
				@click="select(name)"
			>
				<div class="icon">
					<img :src="images.getImage(`${name}.svg`)" :alt="title" />
				</div>

				<span>{{ title }}</span>
			</li>
		</ul>
	</div>
</template>
