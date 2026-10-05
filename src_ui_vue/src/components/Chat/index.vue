<script setup lang="ts">
	import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
	import rpc from '@/utils/rpc';
	import { useAppStore } from '@/stores/app';
	import { commandsList, COMMANDS } from './data';
	import Messages from './messages.vue';
	import Form from './form/index.vue';

	const app = useAppStore();

	const visible = ref(false);
	const showMessages = ref(false);
	const showForm = ref(false);

	const messagesComponent = ref<InstanceType<typeof Messages>>();
	const formComponent = ref<InstanceType<typeof Form>>();

	let visibilityTimeout: ReturnType<typeof setTimeout> | undefined;

	function scrollDown() {
		const el = messagesComponent.value?.listEl;

		if (!el) return;

		el.scrollTop = el.scrollHeight;
	}

	function changeShowMessages(autoHide: boolean) {
		showMessages.value = true;

		if (visibilityTimeout) clearTimeout(visibilityTimeout);

		if (autoHide) {
			visibilityTimeout = setTimeout(() => (showMessages.value = false), 30000);
		}
	}

	function toggleMenu(status?: boolean) {
		const enabled = status ?? !showForm.value;

		showForm.value = enabled;

		(mp as any).invoke('focus', enabled);
		(mp as any).invoke('setTypingInChatState', enabled);

		if (enabled) setTimeout(() => formComponent.value?.inputEl?.focus(), 10);

		changeShowMessages(!enabled);
	}

	async function addMessage(text: string) {
		const prepared: string = await rpc.callClient('PlayerFriends-PrepareString', text);

		app.sendMessage(prepared);
	}

	function getMode(text: string) {
		const command = text.split(' ')[0]?.replace('/', '');

		return (commandsList as Record<string, unknown>)[command ?? ''] ? command : null;
	}

	function sendMessage(value: string) {
		const text = value.trim();
		const mode = getMode(text);

		if (text[0] === '/' && !mode) {
			(mp as any).invoke('command', text.substring(1));
		} else if (text.length) {
			(mp as any).invoke(
				'chatMessage',
				JSON.stringify({
					mode: mode ? (commandsList as Record<string, unknown>)[mode] : COMMANDS.SAY,
					text: text.replace(`/${mode} `, '')
				})
			);
		}

		toggleMenu();
	}

	const keyHandler = (ev: KeyboardEvent) => {
		const { activeElement } = document;

		if (
			visible.value &&
			!showForm.value &&
			ev.keyCode === 84 &&
			activeElement?.tagName !== 'INPUT'
		) {
			toggleMenu(true);
		}
	};

	const api: Record<string, (...args: any[]) => void> = {
		'chat:push': addMessage,
		'chat:activate': (status?: boolean) => toggleMenu(status),
		'chat:show': (status: boolean) => {
			visible.value = status;
		}
	};

	// legacy componentDidUpdate: new message -> show messages + scroll down
	watch(
		() => app.chat.length,
		(length, previous) => {
			if ((previous ?? 0) < length) {
				changeShowMessages(!showForm.value);
				scrollDown();
			}
		}
	);

	onMounted(() => {
		document.addEventListener('keydown', keyHandler);

		if (!mp?.events) return;

		Object.entries(api).forEach(([event, callback]) => {
			mp.events.add(event, callback);
		});

		(window as any).chatAPI = {
			push: api['chat:push'],
			activate: api['chat:activate'],
			show: api['chat:show']
		};

		scrollDown();
		changeShowMessages(true);
	});

	onBeforeUnmount(() => {
		document.removeEventListener('keydown', keyHandler);
		(mp as any).invoke('setTypingInChatState', false);
	});
</script>

<template>
	<div class="chat" :class="{ active: showForm }" :style="{ display: visible ? 'block' : 'none' }">
		<Messages ref="messagesComponent" :active="showMessages" :items="app.chat" />

		<Form v-if="showForm" ref="formComponent" :on-submit="sendMessage" />
	</div>
</template>
