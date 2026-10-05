<script setup lang="ts">
	import dayjs from '@/utils/dayjs';
	import { IoBatteryFull, IoCellular } from '@/utils/icons';

	defineProps<{
		date: string;
	}>();
</script>

<template>
	<div class="phone_status-bar">
		<span class="time">{{ dayjs(date).format('HH:mm') }}</span>

		<div class="icons">
			<IoCellular />
			<IoBatteryFull />
		</div>
	</div>
</template>
