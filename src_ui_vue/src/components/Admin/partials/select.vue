<script setup lang="ts">
	import Select from 'primevue/select';

	export type SelectOption = {
		value: any;
		label: string;
	};

	withDefaults(
		defineProps<{
			modelValue?: any;
			options: SelectOption[];
			placeholder?: string;
			filter?: boolean;
			loading?: boolean;
			invalid?: boolean;
			showClear?: boolean;
		}>(),
		{
			modelValue: null,
			placeholder: '',
			filter: true,
			loading: false,
			invalid: false,
			showClear: false
		}
	);

	const emit = defineEmits<{ 'update:modelValue': [value: any] }>();
</script>

<template>
	<Select
		:model-value="modelValue"
		:options="options"
		option-label="label"
		option-value="value"
		:placeholder="placeholder"
		:filter="filter"
		:loading="loading"
		:invalid="invalid"
		:show-clear="showClear"
		@update:model-value="emit('update:modelValue', $event)"
	/>
</template>
