<script setup lang="ts">
	import PrimaryTitle from '@/components/Common/primary-title.vue';

	defineProps<{
		open: (name: string) => void;
		items: { [name: string]: string };
		current: string;
	}>();
</script>

<template>
	<div class="character_page">
		<PrimaryTitle className="character_page-title">{{ items[current] }}</PrimaryTitle>

		<div class="character_breadcrumbs">
			<div
				v-for="page in Object.keys(items)"
				:key="page"
				:class="['character_breadcrumbs-item', { active: page === current }]"
				@click="open(page)"
			/>
		</div>
	</div>
</template>
