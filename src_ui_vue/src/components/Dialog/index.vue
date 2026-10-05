<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';

	type Answer = {
		text: string;
		callback?: any;
	};

	const title = ref('');
	const text = ref('');
	const answers = ref<Answer[]>([]);

	// legacy: componentDidMount -> setState(location.state)
	onMounted(() => {
		const state = history.state as { title: string; text: string; answers: Answer[] };

		title.value = state.title;
		text.value = state.text;
		answers.value = state.answers;
	});

	function sendAnswer(index: number) {
		rpc.callClient('Dialog-SendAnswer', index);
	}
</script>

<template>
	<div class="dialog">
		<div class="dialog_container">
			<h2 class="dialog_title">{{ title }}</h2>
			<p class="dialog_text">{{ text }}</p>
		</div>

		<div class="dialog_answers">
			<template v-for="(item, index) in answers" :key="index">
				<GradientButton
					v-if="item.callback"
					class-name="dialog_answers-item"
					@click="sendAnswer(index)"
				>
					{{ item.text }}
				</GradientButton>

				<OutlineButton v-else class-name="dialog_answers-item" @click="sendAnswer(index)">
					{{ item.text }}
				</OutlineButton>
			</template>
		</div>
	</div>
</template>
