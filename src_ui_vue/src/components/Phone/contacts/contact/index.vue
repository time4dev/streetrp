<script setup lang="ts">
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import { usePhoneStore } from '@/stores/phone';
	import type { ContactData } from '../index.vue';
	import Navigation from '../../partials/navigation.vue';
	import Button from '../../partials/button.vue';
	import Info from './info.vue';
	import Controls from './controls.vue';

	const phoneStore = usePhoneStore();

	const props = defineProps<{
		contact: ContactData;
		blocked: boolean;
		showEditor: () => void;
		toggleBlacklist: () => void;
		close: () => void;
	}>();

	async function onControlClick(type: string) {
		if (type !== 'call') return;

		try {
			await rpc.callServer('Phone-Call', props.contact.phone);

			phoneStore.setCall({
				type: 'outgoing',
				phoneNumber: props.contact.phone
			});
		} catch (err: any) {
			showNotification('error', 'Абонент временно недоступен');
		}
	}
</script>

<template>
	<div class="contacts_contact">
		<Navigation
			:close="{ title: 'Контакты', onClick: close }"
			:action="{ title: 'Править', onClick: showEditor }"
		/>

		<div class="contacts_contact-header">
			<div class="avatar">
				{{ contact.firstName.charAt(0) }}{{ contact.lastName.charAt(0) }}
			</div>

			<p class="name">{{ contact.firstName }} {{ contact.lastName }}</p>

			<Controls :on-click="onControlClick" />
		</div>

		<Info :phone="contact.phone" />

		<Button :on-click="toggleBlacklist" color="red">
			{{ blocked ? 'Разблокировать' : 'Заблокировать' }}
		</Button>
	</div>
</template>
