<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import { useRotation } from '@/composables/use-rotation';
	import WithPayment from '@/components/Common/with-payment.vue';
	import Page from '@/components/Character/page.vue';
	import Body from '@/components/Character/body.vue';
	import Face from '@/components/Character/face.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import TotalPrice from '@/components/Common/total-price.vue';
	import Hint from '@/components/Common/hint.vue';

	useRotation();

	const pages: { [name: string]: string } = {
		body: 'Персонаж',
		face: 'Черты лица'
	};

	const state = reactive({
		activePage: 'body',
		price: 0
	});

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);
	});

	function openPage(name: string) {
		state.activePage = name;
	}

	// showPayment comes from the WithPayment slot scope
	function switchPage(
		increase: boolean,
		showPayment?: (callback: (payment: string) => Promise<any>) => void
	) {
		const items = Object.keys(pages);
		const pageIndex = items.indexOf(state.activePage);

		if (increase && pageIndex === items.length - 1) return showPayment?.(buy);

		if (!increase && pageIndex === 0) return close();

		openPage(increase ? items[pageIndex + 1] : items[pageIndex - 1]);
	}

	async function buy(payment: string) {
		const data = await rpc.callClient('Surgeon-GetData');

		await rpc.callServer('Surgeon-Buy', [data, payment]);
	}

	function close() {
		rpc.callClient('Surgeon-CloseMenu');
	}
</script>

<template>
	<WithPayment v-slot="{ showPayment }">
		<div class="surgeon">
			<Page :items="pages" :current="state.activePage" :open="openPage" />

			<div class="surgeon_container">
				<button class="character_btn" @click="switchPage(false)">Назад</button>

				<Body v-if="state.activePage === 'body'" />
				<Face v-else-if="state.activePage === 'face'" />

				<TotalPrice class-name="surgeon_price" title="Цена:" :value="state.price" />

				<GradientButton @click="switchPage(true, showPayment)">Далее</GradientButton>
			</div>

			<Hint class-name="character_hint" action="drag">Поворот персонажа</Hint>
		</div>
	</WithPayment>
</template>
