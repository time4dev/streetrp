<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import logo from '@/assets/images/phone/racoon-logo.svg';
	import Form from './form.vue';
	import Prices from './prices.vue';
	import Button from './button.vue';

	const form = ref<'random' | 'custom' | undefined>(undefined);
	const phoneNumber = ref('');
	const prices = ref({
		random: 0,
		custom: 0
	});

	onMounted(() => {
		fetchData();
	});

	async function fetchData() {
		const data = await rpc.callServer('Phone-GetNumberData');

		phoneNumber.value = data.phoneNumber ?? '';
		prices.value = data.prices ?? prices.value;
	}

	function openForm(name?: 'random' | 'custom') {
		form.value = name;
	}

	async function buy(num?: string) {
		try {
			const updated: string = await rpc.callServer('Phone-BuyNumber', num?.trim());

			phoneNumber.value = updated;
			form.value = undefined;
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}
</script>

<template>
	<div class="sim">
		<div class="sim_logo">
			<img :src="logo" alt="racoon" />
		</div>

		<Form
			v-if="form"
			:submit="buy"
			:close="() => openForm(undefined)"
			:custom="form === 'custom'"
		/>

		<form v-else class="sim_form">
			<input type="text" :value="phoneNumber || 'Отсутствует'" readonly />

			<Button :on-click="() => openForm('random')">Случайный</Button>
			<Button :on-click="() => openForm('custom')">Желаемый</Button>
		</form>

		<Prices :random="prices.random" :custom="prices.custom" />
	</div>
</template>
