<script setup lang="ts">
	withDefaults(
		defineProps<{
			type?: 'submit' | 'button';
			onClick?: () => void;
		}>(),
		{}
	);
</script>

<template>
	<button class="sim_btn" :type="type" @click="onClick && onClick()">
		<slot />
	</button>
</template>
