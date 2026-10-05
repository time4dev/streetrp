<script setup lang="ts">
	import factions from '@/data/factions.json';

	const teamColors: { [name: string]: string } = {
		families: '#69d640',
		ballas: '#e344cb',
		vagos: '#fffc00',
		marabunta: '#56c2f5',
		bloods: '#f23838'
	};

	defineProps<{
		name: string;
		members: number;
	}>();

	function factionName(name: string) {
		return (factions as Record<string, string>)[name] ?? name;
	}
</script>

<template>
	<div class="capture_team">
		<h4 class="capture_team-name" :style="{ color: teamColors[name] }">{{ factionName(name) }}</h4>
		<span class="capture_team-members">{{ members }}</span>
	</div>
</template>
