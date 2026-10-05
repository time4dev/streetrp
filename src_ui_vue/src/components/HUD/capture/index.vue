<script setup lang="ts">
	import type { Capture } from '@/stores/hud';
	import Team from './team.vue';
	import Timer from './timer.vue';

	defineProps<Capture>();
</script>

<template>
	<div v-if="time > 0" class="capture">
		<Team :name="defender.name" :members="defender.members" />
		<Timer :current="time" :max="600" />
		<Team :name="attacker.name" :members="attacker.members" />
	</div>
</template>
