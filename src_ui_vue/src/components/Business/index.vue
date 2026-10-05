<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import BusinessConfirm from './confirm.vue';
	import Main from './main.vue';

	type State = {
		isOwner: boolean;
		owner: string;
		price: number;
		income: number;
		paid: number;
		tax: number;
		paymentTime: number | null;
		name: string;
		showConfirm: boolean;
	};

	const state = reactive<State>({
		isOwner: false,
		owner: '',
		price: 0,
		income: 0,
		paid: 0,
		tax: 0,
		paymentTime: null,
		name: '',
		showConfirm: false
	});

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);
	});

	function toggleConfirmModal() {
		state.showConfirm = !state.showConfirm;
	}

	function setPaymentTime(time: number | null) {
		state.paymentTime = time;
	}

	async function startWork() {
		const time: number = await rpc.callServer('Business-Start');
		setPaymentTime(time);
	}

	async function finishWork() {
		await rpc.callServer('Business-Finish');
		setPaymentTime(null);
	}

	async function trade() {
		const { isOwner } = state;

		try {
			await rpc.callServer('Business-Trade');

			showNotification(
				'success',
				isOwner
					? 'Успешная продажа!'
					: 'Поздравляем с покупкой! Для оплаты услуг проследуйте в банк.'
			);

			rpc.callClient('Browser-HidePage');
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}
</script>

<template>
	<div class="business">
		<div class="business_container">
			<Main
				:is-owner="state.isOwner"
				:owner="state.owner"
				:name="state.name"
				:income="state.income"
				:paid="state.paid"
				:price="state.price"
				:tax="state.tax"
				:payment-time="state.paymentTime"
			/>

			<div class="business_buttons">
				<GradientButton v-if="state.isOwner" color="purple" @click="toggleConfirmModal">
					Продать
				</GradientButton>
				<GradientButton
					v-else
					color="green"
					:disabled="!state.isOwner && !!state.owner"
					@click="trade"
				>
					Купить
				</GradientButton>

				<OutlineButton is-close>Выйти</OutlineButton>

				<template v-if="state.isOwner">
					<GradientButton
						v-if="state.paymentTime === null"
						:disabled="!state.isOwner"
						@click="startWork"
					>
						Начать
					</GradientButton>
					<GradientButton
						v-else
						:disabled="!state.isOwner || state.paymentTime > 0"
						@click="finishWork"
					>
						Закончить
					</GradientButton>
				</template>
			</div>
		</div>

		<BusinessConfirm v-if="state.showConfirm" :submit="trade" :cancel="toggleConfirmModal" />
	</div>
</template>
