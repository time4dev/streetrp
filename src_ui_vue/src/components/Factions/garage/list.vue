<script setup lang="ts">
	import vehicleList from '@/data/vehicles.json';

	defineProps<{
		selected?: string;
		items: string[];
	}>();

	const emit = defineEmits<{ select: [model: string] }>();

	const vehicles = vehicleList as Record<string, string>;
</script>

<template>
	<div class="faction-garage_list">
		<ul class="faction-garage_items">
			<li
				v-for="item in items"
				:key="item"
				:class="['faction-garage_item', { active: item === selected }]"
				@click="emit('select', item)"
			>
				{{ vehicles[item] ?? item }}
			</li>
		</ul>
	</div>
</template>
