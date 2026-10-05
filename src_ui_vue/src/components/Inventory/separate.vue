<script setup lang="ts">
	import { ref } from 'vue';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import RcSlider from '@/components/Common/rc-slider.vue';

	const props = defineProps<{
		amount: number;
		confirm: (value: number) => void;
		cancel: () => void;
	}>();

	const value = ref<number>(1);
</script>

<template>
	<div class="inventory_separate">
		<PrimaryTitle className="inventory_separate-title">Разделение предмета</PrimaryTitle>

		<div class="inventory_separate-slider">
			<RcSlider
				:value="value"
				:min="1"
				:max="amount === 1 ? 1 : amount - 1"
				@change="(next: number) => (value = next)"
			/>

			<span class="inventory_separate-current">{{ value }}</span>
			<span class="inventory_separate-max">{{ amount === 1 ? 1 : amount - 1 }}</span>
		</div>

		<div class="inventory_separate-buttons">
			<OutlineButton @click="cancel">Закрыть</OutlineButton>
			<GradientButton @click="confirm(value)">Разделить</GradientButton>
		</div>
	</div>
</template>
