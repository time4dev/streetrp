<script setup lang="ts">
	import { ref, watch } from 'vue';
	import { FaUniversity } from '@/utils/icons';
	import prettify from '@/utils/prettify';

	const props = defineProps<{
		cash: number;
		bank: number;
	}>();

	type Change = {
		type: 'bank' | 'cash';
		amount: number;
		status: boolean;
	};

	const changes = ref<Change>();

	// Legacy usePrevious + useEffect: show the diff for 2 seconds after cash/bank change.
	watch(
		() => [props.cash, props.bank] as const,
		([cash, bank], [prevCash, prevBank]) => {
			if (cash !== prevCash)
				changes.value = {
					type: 'cash',
					amount: cash - prevCash,
					status: cash > prevCash
				};

			if (bank !== prevBank)
				changes.value = {
					type: 'bank',
					amount: bank - prevBank,
					status: bank > prevBank
				};

			setTimeout(() => (changes.value = undefined), 2000);
		}
	);

	function formatChange(status: boolean, amount: number) {
		return `${status ? '+' : ''}${prettify.price(amount).replace('$', '')}`;
	}
</script>

<template>
	<div class="hud_money">
		<p class="hud_money-item">
			{{ prettify.price(cash) }}

			<span
				v-if="changes?.type === 'cash'"
				:class="['hud_money-change', changes.status ? 'positive' : 'negative']"
			>{{ formatChange(changes.status, changes.amount) }}</span>
		</p>

		<p class="hud_money-item">
			<FaUniversity />
			{{ prettify.price(bank) }}

			<span
				v-if="changes?.type === 'bank'"
				:class="['hud_money-change', changes.status ? 'positive' : 'negative']"
			>{{ formatChange(changes.status, changes.amount) }}</span>
		</p>
	</div>
</template>
