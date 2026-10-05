<script setup lang="ts">
	// Faithful port of rc-checkbox@2 (exact DOM/classes).
	const props = withDefaults(
		defineProps<{
			checked?: boolean;
			disabled?: boolean;
			name?: string;
			className?: string;
			prefixCls?: string;
		}>(),
		{
			checked: false,
			disabled: false,
			prefixCls: 'rc-checkbox',
			className: ''
		}
	);

	const emit = defineEmits<{ change: [checked: boolean] }>();

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;

		if (props.disabled) return;

		emit('change', target.checked);
	}
</script>

<template>
	<span
		:class="[
			prefixCls,
			className,
			{ [`${prefixCls}-checked`]: checked, [`${prefixCls}-disabled`]: disabled }
		]"
	>
		<input
			:name="name"
			type="checkbox"
			:class="`${prefixCls}-input`"
			:checked="!!checked"
			:disabled="disabled"
			@change="handleChange"
		/>

		<span :class="`${prefixCls}-inner`"></span>
	</span>
</template>
