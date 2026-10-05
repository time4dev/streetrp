<script setup lang="ts">
	import { ref } from 'vue';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import { usePhoneStore } from '@/stores/phone';
	import prettify from '@/utils/prettify';
	import List from './list.vue';
	import Controls from './controls.vue';

	const phoneStore = usePhoneStore();

	const phoneNumber = ref('');

	function addToNumber(key: string) {
		phoneNumber.value = phoneNumber.value.concat(key);
	}

	function deleteFromNumber() {
		phoneNumber.value = phoneNumber.value.slice(0, -1);
	}

	async function call() {
		if (!phoneNumber.value) return;

		try {
			await rpc.callServer('Phone-Call', phoneNumber.value);

			phoneStore.setCall({
				phoneNumber: phoneNumber.value,
				type: 'outgoing'
			});
		} catch (err: any) {
			showNotification('error', 'Абонент временно недоступен');
		}
	}
</script>

<template>
	<div class="phone_keypad">
		<div class="phone_keypad-value">{{ prettify.phoneNumber(phoneNumber) }}</div>

		<List :add-to-number="addToNumber" />

		<Controls
			:phone-number="phoneNumber"
			:call-number="call"
			:delete-from-number="deleteFromNumber"
		/>
	</div>
</template>
