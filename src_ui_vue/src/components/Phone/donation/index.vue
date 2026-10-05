<script setup lang="ts">
	import { inject, onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import { usePlayerStore } from '@/stores/player';
	import { PHONE_CONTEXT } from '../context';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import products from './products.json';
	import Balance from './balance.vue';
	import Product from './product.vue';

	const playerStore = usePlayerStore();
	const phoneContext = inject(PHONE_CONTEXT)!;

	const prices = ref<Record<string, number>>({
		'10k': 100,
		'50k': 500,
		'200k': 2000,
		'500k': 5000,
		'2kk': 20000,
		'10kk': 100000,
		vehicle_slot: 100,
		backpack: 100,
		military_id: 1500
	});

	onMounted(() => {
		getPrices();
	});

	async function getPrices() {
		const data = await rpc.callServer('Donation-GetPrices');

		prices.value = data;
	}

	async function buy(name: string) {
		try {
			await rpc.callServer('Donation-Buy', name);
			showNotification('success', 'Успешная покупка!');
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}
</script>

<template>
	<div class="donation">
		<div class="donation_container">
			<Balance :current="playerStore.money.points" />

			<div class="donation_products">
				<template v-for="(price, name) in prices" :key="name">
					<Product
						v-if="(products as any)[name]"
						:icon="(products as any)[name].icon"
						:title="(products as any)[name].title"
						:description="(products as any)[name].description"
						:price="price"
						:on-click="() => buy(String(name))"
					/>
				</template>
			</div>
		</div>

		<OutlineButton className="donation_close" :on-click="() => phoneContext.openApp(undefined)">
			Закрыть
		</OutlineButton>
	</div>
</template>
