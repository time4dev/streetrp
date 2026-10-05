<script setup lang="ts">
	import { useField } from 'vee-validate';
	import RcCheckbox from '@/components/Common/rc-checkbox.vue';

	const props = defineProps<{
		label: string;
		name: string;
	}>();

	// legacy: const [field] = useField({...props}) passed to rc-checkbox
	const { value, setValue } = useField<boolean>(props.name);
</script>

<template>
	<label class="admin_checkbox">
		<RcCheckbox
			className="admin-check"
			:checked="!!value"
			:name="props.name"
			@change="(checked: boolean) => setValue(checked)"
		/>

		{{ label }}
	</label>
</template>
