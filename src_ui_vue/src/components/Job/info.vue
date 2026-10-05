<script setup lang="ts">
	import PrimaryTitle from '@/components/Common/primary-title.vue';

	defineProps<{
		description: string;
		requirements: string;
	}>();
</script>

<template>
	<div class="job_info">
		<PrimaryTitle class-name="job_info-title">Информация</PrimaryTitle>

		<p class="job_info-requirements">Требования: <strong>{{ requirements }}</strong>.</p>

		<div class="job_info-descr">
			<p v-for="(item, index) in description.split('\n')" :key="index">{{ item }}</p>
		</div>
	</div>
</template>
