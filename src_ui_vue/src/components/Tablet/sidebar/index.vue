<script setup lang="ts">
	import Profile from './profile.vue';
	import Tabs from './tabs.vue';
	import { getApps } from '../apps';

	defineProps<{
		user: {
			faction: string;
			name: string;
			rank: string;
		};

		activeTab: string;
		openTab: (name: string) => void;
	}>();
</script>

<template>
	<div class="tablet_sidebar">
		<Profile :username="user.name" :faction="user.faction" :rank="user.rank" />
		<Tabs :tabs="getApps(user.faction)" :active-tab="activeTab" :open-tab="openTab" />
	</div>
</template>
