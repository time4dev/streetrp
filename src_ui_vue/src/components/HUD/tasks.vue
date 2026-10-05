<script setup lang="ts">
	import tasks from '@/data/tasks.json';

	defineProps<{
		items: string[];
	}>();

	function taskName(name: string) {
		return (tasks as Record<string, string>)[name];
	}
</script>

<template>
	<div class="hud_tasks">
		<ul class="hud_tasks-list">
			<TransitionGroup name="alert">
				<li v-for="item in items" :key="item" class="hud_tasks-item">{{ taskName(item) }}</li>
			</TransitionGroup>
		</ul>
	</div>
</template>
