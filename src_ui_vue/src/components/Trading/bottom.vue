<script setup lang="ts">
	import prettify from '@/utils/prettify';
	import OutlineInput from '@/components/Common/outline-input.vue';

	defineProps<{
		seller?: string;
		price: number;
		setPrice: (value: number) => void;
	}>();
</script>

<template>
	<div class="trading_bottom">
		<div class="trading_bottom-section">
			<h4>Продавец</h4>
			<p>{{ seller || 'Вы' }}</p>
		</div>

		<div class="trading_bottom-section">
			<h4>Цена</h4>

			<p v-if="seller">{{ prettify.price(price) }}</p>
			<OutlineInput
				v-else
				class-name="trading_input"
				:min="1"
				:max="100000000"
				:value="price"
				@change="setPrice"
			/>
		</div>
	</div>
</template>
