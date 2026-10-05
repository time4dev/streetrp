<script setup lang="ts">
	import { onBeforeUnmount, onMounted, reactive, watch } from 'vue';
	import prettify from '@/utils/prettify';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import BusinessInfoItem from './info-item.vue';

	const props = defineProps<{
		name: string;
		isOwner: boolean;
		owner: string;
		price: number;
		income: number;
		tax: number;
		paid: number;
		paymentTime: number | null;
	}>();

	const state = reactive({
		hour: 0,
		min: 0
	});

	let progressInterval: ReturnType<typeof setInterval> | undefined;

	onMounted(() => {
		runTimer(props.paymentTime);
	});

	watch(
		() => props.paymentTime,
		(time) => runTimer(time)
	);

	onBeforeUnmount(() => {
		stopTimer();
	});

	function runTimer(time: number | null) {
		if (!time || time < 0) return;

		state.hour = Math.floor((time / (1000 * 60 * 60)) % 24);
		state.min = Math.floor((time / 1000 / 60) % 60);

		progressInterval = setInterval(() => {
			if (state.hour === 0 && state.min === 0) return stopTimer();

			if (state.min > 0) state.min -= 1;
			else if (state.hour > 0) {
				state.hour -= 1;
				state.min = 59;
			}
		}, 60000);
	}

	function stopTimer() {
		if (progressInterval) {
			clearInterval(progressInterval);
			progressInterval = undefined;
		}
	}
</script>

<template>
	<div class="business_main">
		<PrimaryTitle>{{ name }}</PrimaryTitle>

		<div class="business_info">
			<BusinessInfoItem title="Владелец">{{ owner || 'Отсутствует' }}</BusinessInfoItem>
			<BusinessInfoItem title="Прибыль за сутки">
				{{ prettify.price(income) }}
			</BusinessInfoItem>
			<BusinessInfoItem title="Стоимость в день">
				{{ prettify.price(tax) }}
			</BusinessInfoItem>
			<BusinessInfoItem :title="isOwner ? 'Гос. продажа' : 'Цена'">
				{{ prettify.price(price) }}
			</BusinessInfoItem>

			<div v-if="isOwner" class="business_info-owned">
				<BusinessInfoItem title="Оплачено дней">{{ paid.toString() }}</BusinessInfoItem>
				<BusinessInfoItem title="До прибыли">
					{{ `${state.hour.toString().padStart(2, '0')}:${state.min
						.toString()
						.padStart(2, '0')}` }}
				</BusinessInfoItem>
			</div>
		</div>
	</div>
</template>
