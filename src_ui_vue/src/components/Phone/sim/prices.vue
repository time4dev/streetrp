<script setup lang="ts">
	import Point from '@/components/Common/point.vue';

	defineProps<{
		random: number;
		custom: number;
	}>();
</script>

<template>
	<div class="sim_prices">
		<h3 class="sim_prices-title">Стоимость услуг</h3>

		<ul class="sim_prices-list">
			<li class="sim_prices-item">
				Случайный номер <span>{{ random }} $</span>
			</li>

			<li class="sim_prices-item">
				Желаемый номер <Point :amount="custom" />
			</li>
		</ul>
	</div>
</template>
