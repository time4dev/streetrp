<script setup lang="ts">
	import { useField } from 'vee-validate';
	import { IoIosCloseCircle } from '@/utils/icons';

	// legacy partials/input.tsx used both as standalone input and as Formik <Field component={Input}>.
	// In Vue it always lives inside a vee-validate <form>, so it binds through useField.
	const props = withDefaults(
		defineProps<{
			type: 'text' | 'number';
			name: string;
			placeholder?: string;
			disabled?: boolean;
		}>(),
		{}
	);

	const { value, setValue } = useField<string | number>(props.name);

	function onInput(event: Event) {
		const raw = (event.target as HTMLInputElement).value;

		setValue(props.type === 'number' ? Number(raw) : raw);
	}

	function reset() {
		setValue(props.type === 'text' ? '' : 0);
	}
</script>

<template>
	<div class="phone_input">
		<input
			:type="type"
			:name="name"
			:placeholder="placeholder"
			:value="value"
			:disabled="disabled"
			@input="onInput"
		/>

		<IoIosCloseCircle v-if="value" className="phone_input-reset" @click="reset" />
	</div>
</template>
