<script setup lang="ts">
	import { ref } from 'vue';
	import images from '@/utils/images';
	import sounds from '@/utils/sounds';

	export type Payment = 'bank' | 'cash';

	const showModal = ref(false);
	let callback: ((payment: Payment) => Promise<any>) | undefined;

	// Legacy HOC `withPayment(WrappedComponent)` equivalent:
	// wrap the original page content in this component and bind `showPayment`
	// from the default slot to the child that used to receive the prop.
	function showPayment(cb?: (payment: Payment) => Promise<any>) {
		showModal.value = !showModal.value;
		callback = cb;
	}

	async function selectType(type: Payment) {
		if (!callback) return showPayment();

		await callback(type);

		sounds.playPayment(type);

		showPayment();
	}
</script>

<template>
	<slot :show-payment="showPayment" />

	<!-- legacy used CSSTransition timeout={0}: the modal appears instantly -->
	<div v-if="showModal" class="payment-modal">
		<h2 class="primary-title payment-modal_title">Выбор способа оплаты</h2>

		<div class="payment-modal_container">
			<div class="payment-modal_type payment-modal_type--bank" @click="selectType('bank')">
				<img :src="images.getImage('bank-card.svg')" alt="bank" />
			</div>

			<div class="payment-modal_type payment-modal_type--cash" @click="selectType('cash')">
				<img :src="images.getImage('cash.svg')" alt="cash" />
			</div>
		</div>

		<button class="outline-btn" @click="showPayment()">Отмена</button>
	</div>
</template>
