<script setup lang="ts">
	import { FaPlus, FaMinus } from '@/utils/icons';

	const props = defineProps<{
		value: number;
		max: number;
		min: number;
	}>();

	const emit = defineEmits<{ change: [value: number] }>();

	function increase() {
		if (props.value >= props.max) return;

		emit('change', props.value + 1);
	}

	function decrease() {
		if (props.value <= props.min) return;

		emit('change', props.value - 1);
	}

	function setMax() {
		emit('change', props.max);
	}

	function handleChangeInput(event: Event) {
		const { min, max } = props;
		const value = parseInt((event.currentTarget as HTMLInputElement).value, 10);

		emit('change', !value || value < min ? min : value > max ? max : value);
	}
</script>

<template>
	<div class="gas_input">
		<button class="gas_input-button" @click="decrease">
			<FaMinus />
		</button>

		<input type="text" :value="value" @input="handleChangeInput" />

		<button class="gas_input-button gas_input-button--inc" @click="increase">
			<FaPlus />
		</button>

		<button class="gas_input-button" @click="setMax">MAX</button>
	</div>
</template>
