<script setup lang="ts">
	import OutlineInput from '@/components/Common/outline-input.vue';
	import Hint from './hint.vue';

	defineProps<{
		value: number;
		select: (quantity: number) => void;
	}>();
</script>

<template>
	<div class="supermarket_quantity">
		<Hint>2. Укажите количество товара</Hint>

		<OutlineInput
			class-name="supermarket_quantity-input"
			:value="value"
			:min="0"
			:max="1000"
			@change="select"
		/>
	</div>
</template>
