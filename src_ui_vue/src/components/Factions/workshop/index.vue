<script setup lang="ts">
	import { computed, onMounted, reactive } from 'vue';
	import { IoAlbums } from '@/utils/icons';
	import { showNotification } from '@/utils/notifications';
	import rpc from '@/utils/rpc';
	import prettify from '@/utils/prettify';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import TotalPrice from '@/components/Common/total-price.vue';
	import Products from './products.vue';
	import Quantity from './quantity.vue';

	type State = {
		materials: number;
		prices: {
			[name: string]: number;
		};
		selectedProduct?: {
			name: string;
			amount: number;
		};
	};

	const state = reactive<State>({
		materials: 0,
		prices: {}
	});

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);
	});

	function selectProduct(productName: string) {
		state.selectedProduct = { name: productName, amount: 1 };
	}

	function changeAmountOfProduct(value: number) {
		if (state.selectedProduct) {
			state.selectedProduct = { ...state.selectedProduct, amount: value };
		}
	}

	// Legacy: getTotalPrice()
	const totalPrice = computed(() =>
		state.selectedProduct ? state.selectedProduct.amount * state.prices[state.selectedProduct.name] : 0
	);

	async function getProduct() {
		const { selectedProduct } = state;

		if (!selectedProduct) return;

		try {
			const materials: number = await rpc.callServer('FactionWorkshop-CraftItem', [
				selectedProduct.name,
				selectedProduct.amount
			]);

			state.materials = materials;
			state.selectedProduct = undefined;
			showNotification('success', 'Вы успешно изготовили предмет');
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}
</script>

<template>
	<div class="workshop">
		<div class="workshop_container">
			<div class="workshop_header">
				<PrimaryTitle class-name="workshop_title">Мастерская</PrimaryTitle>

				<div class="workshop_balance">
					<IoAlbums />
					<span>{{ prettify.materials(state.materials) }}</span>
				</div>
			</div>

			<Products
				:items="state.prices"
				:selected="state.selectedProduct?.name"
				@select-item="selectProduct"
			/>
			<Quantity :value="state.selectedProduct?.amount ?? 0" @select="changeAmountOfProduct" />
		</div>

		<div class="workshop_footer">
			<OutlineButton is-close>Закрыть</OutlineButton>

			<TotalPrice
				class-name="workshop_price"
				title-class-name="workshop_price-title"
				:value="totalPrice"
				:formatter="prettify.materials"
			/>

			<GradientButton @click="getProduct">Изготовить</GradientButton>
		</div>
	</div>
</template>
