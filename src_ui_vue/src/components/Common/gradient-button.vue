<script setup lang="ts">
	withDefaults(
		defineProps<{
			children?: string;
			type?: 'button' | 'submit' | 'reset';
			color?: 'green' | 'orange' | 'purple';
			className?: string;
			disabled?: boolean;
			form?: string;
		}>(),
		{ color: 'orange' }
	);

	const emit = defineEmits<{ click: [] }>();
</script>

<template>
	<button
		:class="['gradient-btn', className, `gradient-btn--${color}`]"
		:type="type"
		:form="form"
		:disabled="disabled"
		@click="emit('click')"
	>
		<slot />
	</button>
</template>
