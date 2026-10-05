<script setup lang="ts">
	import dayjs from '@/utils/dayjs';

	defineProps<{
		value: string;
	}>();
</script>

<template>
	<div class="hud_date">
		<span class="hud_date-item hud_date-item--time">
			{{ dayjs(value).format('HH:mm') }}
		</span>
		<span class="hud_date-item hud_date-item">
			{{ dayjs(value).format('DD.MM.YYYY') }}
		</span>
	</div>
</template>
