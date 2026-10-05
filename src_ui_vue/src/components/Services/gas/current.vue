<script setup lang="ts">
	import PrimaryTitle from '@/components/Common/primary-title.vue';

	defineProps<{
		type: string;
		percent: number;
	}>();

	const types: { [name: string]: string } = {
		diesel: 'Diesel',
		low: 'A95',
		mid: 'A98'
	};
</script>

<template>
	<div class="gas_current">
		<PrimaryTitle class-name="gas_current-title">Информация</PrimaryTitle>

		<div class="gas_current-container">
			<div class="gas_current-fill" :style="{ height: `${percent}%` }" />

			<span class="gas_current-percent">{{ Math.round(percent) }}%</span>

			<div class="gas_current-type">
				<h4>Тип топлива</h4>
				<span>{{ types[type] }}</span>
			</div>
		</div>
	</div>
</template>
