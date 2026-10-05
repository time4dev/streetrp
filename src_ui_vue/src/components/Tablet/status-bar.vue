<script setup lang="ts">
	import dayjs from '@/utils/dayjs';
	import { IoWifi, IoBatteryFull, IoNavigateOutline } from '@/utils/icons';

	defineProps<{
		date: string;
	}>();
</script>

<template>
	<div class="tablet_status-bar">
		<span class="time">{{ dayjs(date).format('hh:mm, dddd, DD MMMM') }}</span>

		<div class="icons">
			<div class="icons_item icons_item--wifi">
				<IoWifi />
			</div>

			<div class="icons_item icons_item--navigate">
				<IoNavigateOutline />
			</div>

			<div class="icons_item icons_item--battery">
				<IoBatteryFull />
			</div>
		</div>
	</div>
</template>
