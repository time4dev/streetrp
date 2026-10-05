<script setup lang="ts">
	import { computed } from 'vue';

	// framework7-react <ListInput> (with clearButton/info support)
	const props = withDefaults(
		defineProps<{
			name?: string;
			type?: string;
			placeholder?: string;
			info?: string;
			clearButton?: boolean;
			disabled?: boolean;
			modelValue?: string | number;
		}>(),
		{
			name: '',
			type: 'text',
			placeholder: '',
			info: '',
			clearButton: false,
			disabled: false,
			modelValue: ''
		}
	);

	const emit = defineEmits<{ 'update:modelValue': [value: string]; 'input-clear': [] }>();

	const hasValue = computed(() => props.modelValue !== '' && props.modelValue !== undefined);

	function onInput(event: Event) {
		emit('update:modelValue', (event.target as HTMLInputElement).value);
		emit('input-clear');
	}

	function clear() {
		emit('update:modelValue', '');
		emit('input-clear');
	}
</script>

<template>
	<li class="item-content item-input">
		<div class="item-inner" :class="{ 'item-input-with-value': hasValue }">
			<div class="item-input-wrap">
				<input
					:type="type"
					:name="name"
					:placeholder="placeholder"
					:value="modelValue"
					:disabled="disabled"
					@input="onInput"
				/>

				<span
					v-if="clearButton"
					class="input-clear-button"
					@click="clear"
				></span>
			</div>

			<div v-if="info" class="item-input-info">{{ info }}</div>
		</div>
	</li>
</template>
