<script setup lang="ts">
	import PrimaryTitle from '@/components/Common/primary-title.vue';

	defineProps<{
		items: number[];
		current: number;
	}>();
</script>

<template>
	<div class="daily_bonus">
		<PrimaryTitle class-name="daily_bonus-title">Ежедневный бонус</PrimaryTitle>

		<div class="daily_bonus-items">
			<h4 class="title">День</h4>

			<ul>
				<li v-for="(item, index) in items" :key="index" :class="{ active: current === index }">
					<div class="description">{{ item }}$</div>

					<span class="day">{{ index + 1 }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>
