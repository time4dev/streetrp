<script setup lang="ts">
	// framework7-react <Toggle>
	withDefaults(
		defineProps<{
			checked?: boolean;
			name?: string;
			color?: string;
		}>(),
		{
			checked: false,
			name: '',
			color: ''
		}
	);

	const emit = defineEmits<{ change: [checked: boolean] }>();

	function onChange(event: Event) {
		emit('change', (event.target as HTMLInputElement).checked);
	}
</script>

<template>
	<label :class="['toggle', 'toggle-ios', color && `color-${color}`]">
		<input type="checkbox" :name="name" :checked="checked" @change="onChange" />
		<span class="toggle-icon"></span>
	</label>
</template>
