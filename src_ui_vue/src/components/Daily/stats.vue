<script setup lang="ts">
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import Point from '@/components/Common/point.vue';

	defineProps<{
		money: number;
		level: number;
		experience: [number, number];
	}>();
</script>

<template>
	<div class="daily_stats">
		<PrimaryTitle class-name="daily_stats-title">Статистика</PrimaryTitle>

		<div class="daily_stats-container">
			<Point class-name="daily_stats-money" :amount="money" />

			<div class="daily_stats-experience">
				<h4 class="title">Опыт</h4>

				<div class="progress">
					<div class="progress_bar">
						<div
							class="progress_bar-fill"
							:style="{ width: `${(experience[0] * 100) / experience[1]}%` }"
						/>
					</div>

					<div class="progress_points">
						{{ experience[0] }} / {{ experience[1] }}
					</div>
				</div>
			</div>

			<div class="daily_stats-level">
				<h4 class="title">Уровень</h4>

				<span class="current">{{ level }}</span>
			</div>
		</div>
	</div>
</template>
