<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import { usePhoneStore } from '@/stores/phone';
	import prettify from '@/utils/prettify';
	import type { ContactData } from '../contacts/index.vue';
	import Incoming from './incoming.vue';
	import Outgoing from './outgoing.vue';

	const phoneStore = usePhoneStore();

	const interlocutor = ref('Anonymous');

	onMounted(() => {
		getInterlocutorName();
	});

	async function getInterlocutorName() {
		const call = phoneStore.call;

		if (call) {
			const contact: ContactData = await rpc.callServer(
				'Phone-GetContactByNumber',
				call.phoneNumber
			);

			interlocutor.value = contact
				? `${contact.firstName} ${contact.lastName}`
				: prettify.phoneNumber(call.phoneNumber);
		}
	}

	async function acceptCall() {
		const call = phoneStore.call;

		if (!call) return;

		try {
			await rpc.callServer('Phone-AcceptCall');

			phoneStore.setCall({
				type: 'outgoing',
				phoneNumber: call.phoneNumber,
				isRecieve: true
			});
		} catch (err: any) {
			declineCall();
		}
	}

	function declineCall() {
		const call = phoneStore.call;

		if (call) rpc.callServer('Phone-DeclineCall');
	}

	function onControlClick(control: string) {
		switch (control) {
			case 'accept':
				return acceptCall();

			case 'decline':
				return declineCall();
		}
	}
</script>

<template>
	<div v-if="phoneStore.call" class="call">
		<Incoming
			v-if="phoneStore.call.type === 'incoming'"
			:name="interlocutor"
			:on-control-click="onControlClick"
		/>

		<Outgoing
			v-else
			:name="interlocutor"
			:is-recieve-call="!!phoneStore.call.isRecieve"
			:on-control-click="onControlClick"
		/>
	</div>
</template>
