<script setup lang="ts">
	import Checkbox from 'primevue/checkbox';

	withDefaults(
		defineProps<{
			modelValue: boolean;
			label?: string;
			invalid?: boolean;
		}>(),
		{
			label: '',
			invalid: false
		}
	);

	const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<template>
	<label class="admin__inline">
		<Checkbox
			:model-value="modelValue"
			binary
			:invalid="invalid"
			@update:model-value="emit('update:modelValue', !!$event)"
		/>
		<span v-if="label" class="p-checkbox-label">{{ label }}</span>
	</label>
</template>
