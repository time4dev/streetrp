<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import { usePlayerStore } from '@/stores/player';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import Logo from './logo.vue';
	import Info from './info/index.vue';
	import Tabs from './tabs.vue';
	import Cash from './cash.vue';
	import Replenish from './replenish.vue';
	import Transfer from './transfer.vue';
	import House from './house.vue';
	import Account from './account.vue';
	import Business from './business.vue';

	type State = {
		name: string;
		account: string;
		comission: number;
		prices: { [name: string]: number };

		activeTab?: string;
	};

	const player = usePlayerStore();

	const state = reactive<State>({
		name: 'Street_Roleplay',
		account: '',
		comission: 0,
		prices: {
			account: 12
		}
	});

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);
	});

	function openTab(name?: string) {
		state.activeTab = name;
	}

	function setBankAccount(account: string) {
		state.account = account;
	}
</script>

<template>
	<div class="bank">
		<Logo />

		<div class="bank_container">
			<Info :name="state.name" :money="player.money.bank" :account="state.account" />

			<Transition name="alert">
				<Transfer v-if="state.activeTab === 'transfer'" :comission="state.comission" />
				<Cash v-else-if="state.activeTab === 'cash_out'" />
				<Replenish v-else-if="state.activeTab === 'replenish'" />
				<House v-else-if="state.activeTab === 'house'" />
				<Business v-else-if="state.activeTab === 'business'" />
				<Tabs v-else-if="!state.activeTab" :open-tab="openTab" />
				<Account v-else :price="state.prices.account" :set-account="setBankAccount" />
			</Transition>

			<OutlineButton v-if="state.activeTab" class-name="bank_close-btn" @click="openTab()">
				Назад
			</OutlineButton>
			<OutlineButton v-else class-name="bank_close-btn" is-close>Закрыть</OutlineButton>
		</div>
	</div>
</template>
