<script setup lang="ts">
	import { FaHamburger } from '@/utils/icons';

	defineProps<{
		amount: number;
	}>();
</script>

<template>
	<div :class="['hud_hunger', amount >= 50 ? 'high' : amount >= 20 ? 'medium' : 'low']">
		<FaHamburger />
	</div>
</template>
