<script setup lang="ts">
	defineProps<{
		pressed?: boolean;
	}>();
</script>

<template>
	<div :class="['hud_key', { active: pressed }]">
		<slot />
	</div>
</template>
