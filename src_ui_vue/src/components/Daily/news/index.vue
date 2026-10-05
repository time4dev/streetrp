<script setup lang="ts">
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import Cars from './cars.vue';
	import Donation from './donation.vue';
	import Update from './update.vue';

	defineProps<{
		type: string;
	}>();
</script>

<template>
	<div class="daily_news">
		<PrimaryTitle class-name="daily_news-title">Новости</PrimaryTitle>

		<Donation v-if="type === 'donation'" />
		<Update v-else-if="type === 'update'" />
		<Cars v-else />
	</div>
</template>
