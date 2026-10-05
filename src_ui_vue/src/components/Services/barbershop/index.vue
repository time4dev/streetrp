<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import { useRotation } from '@/composables/use-rotation';
	import WithPayment from '@/components/Common/with-payment.vue';
	import Appearance from '@/components/Character/appearance/index.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import TotalPrice from '@/components/Common/total-price.vue';
	import Hint from '@/components/Common/hint.vue';

	useRotation();

	const state = reactive({
		price: 0
	});

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);
	});

	async function buy(payment: string) {
		const data = await rpc.callClient('Barbershop-GetData');

		await rpc.callServer('Barbershop-Buy', [data, payment]);
	}

	function close() {
		rpc.callClient('Barbershop-CloseMenu');
	}
</script>

<template>
	<WithPayment v-slot="{ showPayment }">
		<div class="barbershop">
			<Hint class-name="character_hint" action="drag">Поворот персонажа</Hint>

			<div class="barbershop_container">
				<button class="character_btn" @click="close">Назад</button>

				<Appearance />

				<TotalPrice class-name="barbershop_price" title="Цена:" :value="state.price" />

				<GradientButton @click="showPayment(buy)">Купить</GradientButton>
			</div>
		</div>
	</WithPayment>
</template>
