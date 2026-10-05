<script setup lang="ts">
	import dayjs from '@/utils/dayjs';
	import { IoIosCheckmarkCircleOutline } from '@/utils/icons';

	defineProps<{
		sender: string;
		message: string;
		time: string;
		onAccept: () => void;
	}>();
</script>

<template>
	<div class="admin_reports-item">
		<span class="admin_reports-sender">{{ sender }}</span>
		<p class="admin_reports-message">{{ message }}</p>

		<span class="admin_reports-time">{{ dayjs(time).format('DD.MM.YY, HH:mm') }}</span>

		<button class="admin_reports-accept" @click="onAccept">
			<IoIosCheckmarkCircleOutline />
		</button>
	</div>
</template>
