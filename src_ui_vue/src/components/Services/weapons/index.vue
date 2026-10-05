<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import WithPayment from '@/components/Common/with-payment.vue';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import TotalPrice from '@/components/Common/total-price.vue';
	import Categories from './categories.vue';
	import Preview from './preview.vue';
	import Spec from './spec.vue';
	import Ammo from './ammo.vue';
	import List from './list.vue';

	type State = {
		prices: { [name: string]: number };
		activeCategory: string;
		selectedWeapon: string;
	};

	const state = reactive<State>({
		prices: {},
		activeCategory: 'melee',
		selectedWeapon: 'bottle'
	});

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;
		const { prices } = data as { prices: { [name: string]: number } };

		state.prices = prices;
		state.selectedWeapon = Object.keys(prices)[0];
	});

	function setCategory(name: string) {
		state.activeCategory = name;
	}

	function selectWeapon(name: string) {
		state.selectedWeapon = name;
	}

	async function buy(payment: string) {
		const { selectedWeapon } = state;

		await rpc.callServer('Weapons-Buy', [selectedWeapon, payment]);
	}
</script>

<template>
	<WithPayment v-slot="{ showPayment }">
		<div class="weapons">
			<div class="weapons_main">
				<Categories :current="state.activeCategory" :select="setCategory" />

				<PrimaryTitle class-name="weapons_title">Ammu-Nation</PrimaryTitle>
				<List
					:category="state.activeCategory"
					:selected="state.selectedWeapon"
					:select-item="selectWeapon"
				/>

				<div class="weapons_footer">
					<OutlineButton is-close>Закрыть</OutlineButton>

					<TotalPrice class-name="weapons_price" :value="state.prices[state.selectedWeapon]" />

					<GradientButton @click="showPayment(buy)">Купить</GradientButton>
				</div>
			</div>

			<div class="weapons_container">
				<Preview :weapon="state.selectedWeapon" />
				<Spec :weapon="state.selectedWeapon" />

				<Ammo :prices="state.prices" :show-payment="showPayment" />
			</div>
		</div>
	</WithPayment>
</template>
