<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Main from './main.vue';
	import Quality from './quality.vue';
	import Info from './info.vue';
	import Confirm from './confirm.vue';

	type State = {
		index: number;
		type: string;
		isOwner: boolean;
		entrance: boolean;
		locked: boolean;
		owner: string;
		paid: number;
		price: number;
		tax: number;
		inventory: number;
		vehicles: number;
		showConfirm: boolean;
	};

	const state = reactive<State>({
		showConfirm: false,
		index: 0,
		type: 'low',
		isOwner: false,
		entrance: false,
		locked: false,
		owner: '',
		paid: 0,
		price: 0,
		inventory: 0,
		vehicles: 0,
		tax: 0
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

	async function trade() {
		const { isOwner } = state;

		try {
			await rpc.callServer('House-Trade');

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

	async function toggleLock() {
		try {
			const status: boolean = await rpc.callServer('House-ToggleLock');

			state.locked = status;
		} catch (err) {
			showNotification('error', 'Нет доступа!');

			return Promise.reject();
		}
	}

	async function toEnter() {
		try {
			await rpc.callServer('House-ToEnter');

			rpc.callClient('Browser-HidePage');
		} catch (err) {
			showNotification('error', 'Дверь заперта');
		}
	}
</script>

<template>
	<div class="house">
		<div class="house_container">
			<Quality :type="state.type" />
			<Main
				:index="state.index"
				:locked="state.locked"
				:toggle-lock="toggleLock"
				:inventory="state.inventory"
				:vehicles="state.vehicles"
			/>
			<Info
				:is-owner="state.isOwner"
				:owner="state.owner"
				:tax="state.tax"
				:price="state.price"
				:paid="state.paid"
			/>

			<div class="house_buttons">
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

				<OutlineButton is-close>Отмена</OutlineButton>

				<GradientButton @click="toEnter">
					{{ state.entrance ? 'Войти' : 'Выйти' }}
				</GradientButton>
			</div>
		</div>

		<Confirm v-if="state.showConfirm" :submit="trade" :cancel="toggleConfirmModal" />
	</div>
</template>
