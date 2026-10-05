<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import prettify from '@/utils/prettify';
	import type { Call } from '@/stores/phone';

	const props = defineProps<{
		info: Call;
	}>();

	const name = ref('Anonymous');

	onMounted(async () => {
		if (props.info) {
			const contact = await rpc.callServer('Phone-GetContactByNumber', props.info.phoneNumber);

			name.value = contact
				? `${contact.firstName} ${contact.lastName}`
				: prettify.phoneNumber(props.info.phoneNumber);
		}
	});
</script>

<template>
	<div class="hud_call">
		<h4 class="hud_call-title">Вам звонят</h4>

		<div class="hud_call-name">{{ name }}</div>
	</div>
</template>
