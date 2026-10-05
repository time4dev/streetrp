<script setup lang="ts">
	import Point from '@/components/Common/point.vue';

	defineProps<{
		current: number;
	}>();
</script>

<template>
	<div class="donation_balance">
		<h3 class="donation_balance-title">Баланс</h3>

		<Point className="donation_balance-current" :amount="current" />
	</div>
</template>
