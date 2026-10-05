<script setup lang="ts">
	import { computed } from 'vue';

	const props = withDefaults(
		defineProps<{
			value: number;
			max: number;
			min: number;
			className?: string;
		}>(),
		{}
	);

	const emit = defineEmits<{ change: [value: number] }>();

	const display = computed(() => props.value);

	function handleInput(event: Event) {
		const { min, max } = props;
		const value = parseInt((event.currentTarget as HTMLInputElement).value, 10);

		emit('change', !value || value < min ? min : value > max ? max : value);
	}
</script>

<template>
	<input
		:class="['outline-input', className]"
		type="text"
		:value="display"
		@input="handleInput"
	/>
</template>
