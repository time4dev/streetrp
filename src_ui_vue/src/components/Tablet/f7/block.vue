<script setup lang="ts">
	withDefaults(
		defineProps<{
			strong?: boolean;
			inset?: boolean;
		}>(),
		{
			strong: false,
			inset: false
		}
	);
</script>

<template>
	<div :class="['block', { 'block-strong': strong, inset }]">
		<slot />
	</div>
</template>
