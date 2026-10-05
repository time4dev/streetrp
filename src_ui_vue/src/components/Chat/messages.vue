<script setup lang="ts">
	defineProps<{
		active: boolean;
		items: string[];
	}>();

	const listEl = ref<HTMLUListElement>();

	function prepareMessageText(text: string) {
		const msg = text
			.replace(/[<>]+/g, '')
			.replace(/!{([a-fA-F0-9]{6}|[a-fA-F0-9]{3})}/g, '<font style="color: #$1;" >');

		return msg;
	}

	defineExpose({ listEl });
</script>

<script lang="ts">
	import { ref } from 'vue';

	export default { name: 'ChatMessages' };
</script>

<template>
	<div :class="['chat_messages', { active }]">
		<ul ref="listEl" class="chat_messages-list">
			<li
				v-for="(item, index) in items"
				:key="index"
				class="chat_messages-item"
				v-html="prepareMessageText(item)"
			/>
		</ul>
	</div>
</template>
