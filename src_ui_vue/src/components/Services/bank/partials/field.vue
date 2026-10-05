<script setup lang="ts">
	import { useField } from 'vee-validate';

	const props = defineProps<{
		type: string;
		name: string;
		placeholder: string;
		label?: string;
	}>();

	const emit = defineEmits<{ blur: [event: FocusEvent] }>();

	// Formik <Field> render-prop equivalent
	const { value, handleBlur } = useField<string | number>(props.name);

	function onBlur(event: FocusEvent) {
		handleBlur(event);

		emit('blur', event);
	}
</script>

<template>
	<div class="bank_field">
		<input
			v-model="value"
			class="outline-input bank_field-input"
			:type="type"
			:name="name"
			:placeholder="placeholder"
			@blur="onBlur"
		/>

		<p class="bank_field-label">{{ label }}</p>
	</div>
</template>
