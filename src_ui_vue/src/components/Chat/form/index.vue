<script setup lang="ts">
	import { ref } from 'vue';
	import { IoIosSend } from '@/utils/icons';
	import { prepareValue } from './validation';

	const props = defineProps<{
		onSubmit: (text: string) => void;
	}>();

	const value = ref('');
	const inputEl = ref<HTMLInputElement>();

	function submit() {
		props.onSubmit(prepareValue(value.value));
		value.value = '';
	}

	defineExpose({ inputEl });
</script>

<template>
	<div class="chat_form">
		<form @submit.prevent="submit">
			<div class="chat_form-container">
				<input v-model="value" type="text" ref="inputEl" />

				<button type="submit" class="chat_form-submit">
					<IoIosSend />
				</button>
			</div>
		</form>
	</div>
</template>
