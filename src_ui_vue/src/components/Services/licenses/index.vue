<script setup lang="ts">
	import { onMounted, reactive, ref } from 'vue';
	import dayjs from '@/utils/dayjs';
	import rpc from '@/utils/rpc';
	import WithPayment from '@/components/Common/with-payment.vue';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import Item from './item.vue';
	import ScrollControls from './scroll.vue';

	type State = {
		prices: { [name: string]: number };
		licenses: { [name: string]: string };
		updatePercent: number;
	};

	const state = reactive<State>({
		prices: {},
		licenses: {},
		updatePercent: 50
	});

	const list = ref<HTMLDivElement>();

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);
	});

	function isValidLicense(license: string) {
		const date = state.licenses[license];

		return !!date && dayjs().diff(date, 'days') <= 0;
	}

	function getPrice(license: string) {
		const { prices, licenses, updatePercent } = state;

		const price = prices[license];
		const isBought = !!licenses[license];

		return isBought ? price - (price / 100) * updatePercent : price;
	}

	async function buy(name: string, payment: string) {
		const { licenses } = state;

		await rpc.callServer('Licenses-Buy', [name, payment]);

		state.licenses = { ...licenses, [name]: dayjs().add(1, 'months').toISOString() };
	}
</script>

<template>
	<WithPayment v-slot="{ showPayment }">
		<div class="licenses">
			<PrimaryTitle class-name="licenses_title">Мэрия</PrimaryTitle>

			<div ref="list" class="licenses_items">
				<Item
					v-for="license in Object.keys(state.prices)"
					:key="license"
					:name="license"
					:price="getPrice(license)"
					:bought="isValidLicense(license)"
					:buy="() => showPayment((payment) => buy(license, payment))"
				/>
			</div>

			<ScrollControls :list="list" />

			<OutlineButton class-name="licenses_close" is-close>Закрыть</OutlineButton>
		</div>
	</WithPayment>
</template>
