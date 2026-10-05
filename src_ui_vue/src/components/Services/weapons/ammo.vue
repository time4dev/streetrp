<script setup lang="ts">
	import { computed, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import prettify from '@/utils/prettify';
	import { useAnimatedNumber } from '@/composables/use-animated-number';
	import type { Payment } from '@/components/Common/with-payment.vue';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import OutlineInput from '@/components/Common/outline-input.vue';

	const types: { [name: string]: string } = {
		'9mm': 'Малый',
		'7.62mm': 'Крупный',
		'12gauge': 'Дробь'
	};

	const props = defineProps<{
		prices: { [name: string]: number };
		showPayment: (cb?: (payment: Payment) => Promise<any>) => void;
	}>();

	const state = reactive({
		type: '9mm',
		amount: 0
	});

	function setType(name: string) {
		state.type = name;
	}

	function setAmount(amount: number) {
		state.amount = amount;
	}

	async function buy(payment: string) {
		const { type, amount } = state;

		if (!amount || amount < 0 || !types[type]) throw new Error('wrong data');

		await rpc.callServer('Weapons-BuyAmmo', [type, amount, payment]);

		state.amount = 0;
	}

	// port of animated-number-react (rendered as a <span>, like the original)
	const price = computed(() => props.prices[state.type] * state.amount);
	const displayPrice = useAnimatedNumber(price, 300);
</script>

<template>
	<div class="weapons_ammo">
		<PrimaryTitle class-name="weapons_ammo-title">Патроны</PrimaryTitle>

		<div class="weapons_ammo-types">
			<OutlineButton
				v-for="(title, name) in types"
				:key="name"
				:class-name="state.type === name ? 'weapons_ammo-type active' : 'weapons_ammo-type'"
				@click="setType(name)"
			>
				{{ title }}
			</OutlineButton>
		</div>

		<div class="weapons_ammo-amount">
			<h4 class="title">Количество</h4>

			<OutlineInput :value="state.amount" :max="1000" :min="0" @change="setAmount" />
		</div>

		<div class="weapons_ammo-footer">
			<span class="weapons_ammo-price">{{ prettify.price(displayPrice) }}</span>

			<GradientButton
				class-name="weapons_ammo-submit"
				color="green"
				@click="showPayment(buy)"
			>
				Купить
			</GradientButton>
		</div>
	</div>
</template>
