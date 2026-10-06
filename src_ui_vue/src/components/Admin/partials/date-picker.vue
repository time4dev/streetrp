<script setup lang="ts">
	import { computed } from 'vue';
	import DatePicker from 'primevue/datepicker';

	const props = withDefaults(
		defineProps<{
			modelValue?: string;
			placeholder?: string;
			invalid?: boolean;
		}>(),
		{
			modelValue: '',
			placeholder: 'Выберите дату',
			invalid: false
		}
	);

	const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

	// Stored as an ISO string (same contract the legacy picker used).
	const value = computed({
		get: () => (props.modelValue ? new Date(props.modelValue) : null),
		set: (date: Date | null) => emit('update:modelValue', date ? date.toISOString() : '')
	});
</script>

<template>
	<DatePicker
		v-model="value"
		show-time
		hour-format="24"
		date-format="dd.mm.yy"
		:placeholder="placeholder"
		:invalid="invalid"
		show-icon
		icon-display="input"
	/>
</template>
