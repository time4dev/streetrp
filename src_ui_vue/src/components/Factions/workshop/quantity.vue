<script setup lang="ts">
	import OutlineInput from '@/components/Common/outline-input.vue';
	import Hint from './hint.vue';

	defineProps<{
		value: number;
	}>();

	const emit = defineEmits<{ select: [quantity: number] }>();
</script>

<template>
	<div class="workshop_quantity">
		<Hint>2. Укажите количество предмета</Hint>

		<OutlineInput
			class-name="workshop_quantity-input"
			:value="value"
			:min="0"
			:max="1000"
			@change="emit('select', $event)"
		/>
	</div>
</template>
