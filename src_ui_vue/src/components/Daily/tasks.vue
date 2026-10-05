<script setup lang="ts">
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import tasks from '@/data/tasks.json';

	defineProps<{
		items: {
			[name: string]: number[];
		};
	}>();

	function taskName(name: string) {
		return (tasks as Record<string, string>)[name];
	}
</script>

<template>
	<div class="daily_tasks">
		<PrimaryTitle class-name="daily_tasks-title">Ежедневные задания</PrimaryTitle>

		<div class="daily_tasks-container">
			<ul class="daily_tasks-items">
				<li v-for="(points, item) in items" :key="item" class="daily_tasks-item">
					<span class="name">{{ taskName(item) }}</span>

					<span class="points">
						{{ points[0] }} / {{ points[1] }}
					</span>
				</li>
			</ul>
		</div>
	</div>
</template>
