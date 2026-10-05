<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import { IoIosAdd } from '@/utils/icons';
	import { showNotification } from '@/utils/notifications';
	import Title from '../partials/title.vue';
	import Navigation from '../partials/navigation.vue';
	import SearchInput from '../partials/search.vue';
	import List from './list.vue';
	import Contact from './contact/index.vue';
	import Editor from './editor.vue';

	export type ContactData = {
		phone: string;
		firstName: string;
		lastName: string;
	};

	const contacts = ref<ContactData[]>([]);
	const blacklist = ref<string[]>([]);
	const showEditor = ref(false);
	const searchValue = ref('');
	const selectedContact = ref<ContactData | undefined>(undefined);

	onMounted(() => {
		rpc.callServer('Phone-GetContactsData').then((data: any) => {
			contacts.value = data.contacts ?? [];
			blacklist.value = data.blacklist ?? [];
		});
	});

	function toggleEditor() {
		showEditor.value = !showEditor.value;
	}

	function selectContact(contact?: ContactData) {
		selectedContact.value = contact;
	}

	async function saveContact(data: ContactData) {
		const contact = selectedContact.value;

		try {
			await rpc.callServer(
				contact ? 'Phone-EditContact' : 'Phone-AddContact',
				contact ? [contact.phone, data] : data
			);

			contacts.value = contact
				? contacts.value.map((item) => (item.phone === contact.phone ? data : item))
				: [...contacts.value, data];

			selectedContact.value = data;

			toggleEditor();
		} catch (err: any) {
			showNotification('error', 'Контакт с указанным номером уже существует');
		}
	}

	async function deleteContact() {
		const contact = selectedContact.value;

		if (!contact) return;

		await rpc.callServer('Phone-DeleteContact', contact.phone);

		contacts.value = contacts.value.filter((item) => item.phone !== contact.phone);
		selectedContact.value = undefined;

		toggleEditor();
	}

	async function toggleBlacklist() {
		const contact = selectedContact.value;

		if (!contact) return;

		const blocked = isBlocked(contact);

		await rpc.callServer(
			blocked ? 'Phone-UnblockContact' : 'Phone-BlockContact',
			contact.phone
		);

		blacklist.value = blocked
			? blacklist.value.filter((item) => item !== contact.phone)
			: [...blacklist.value, contact.phone];
	}

	function getFilteredItems() {
		return contacts.value
			.filter((item) => {
				const name = `${item.firstName} ${item.lastName}`;

				return name.toLowerCase().indexOf(searchValue.value.toLowerCase()) !== -1;
			})
			.sort((a, b) => a.firstName.localeCompare(b.firstName));
	}

	function isBlocked(contact: ContactData) {
		return blacklist.value.includes(contact.phone);
	}
</script>

<template>
	<div class="contacts">
		<Editor
			v-if="showEditor"
			:contact="selectedContact"
			:save="saveContact"
			:remove="deleteContact"
			:close="toggleEditor"
		/>

		<Contact
			v-else-if="selectedContact"
			:contact="selectedContact"
			:blocked="isBlocked(selectedContact)"
			:show-editor="toggleEditor"
			:toggle-blacklist="toggleBlacklist"
			:close="() => selectContact()"
		/>

		<template v-else>
			<Navigation
				:action="{
					title: IoIosAdd,
					onClick: toggleEditor
				}"
			/>

			<div class="header">
				<Title>Контакты</Title>

				<SearchInput
					placeholder="Поиск"
					:value="searchValue"
					@change="(value: string) => (searchValue = value)"
				/>
			</div>

			<List :contacts="getFilteredItems()" :select-contact="selectContact" />
		</template>
	</div>
</template>
