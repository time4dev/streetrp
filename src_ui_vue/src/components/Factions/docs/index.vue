<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import { IoClose } from '@/utils/icons';
	import Field from './field.vue';

	type State = {
		faction: string;
		name: string;
		rank: string;
	};

	const state = reactive<State>({
		faction: 'ems',
		name: '',
		rank: ''
	});

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);
	});

	function closeMenu() {
		rpc.callClient('Browser-HidePage');
	}
</script>

<template>
	<div :class="['faction-docs', `faction-docs--${state.faction}`]">
		<div class="faction-docs_container">
			<span class="faction-docs_close" @click="closeMenu">
				<IoClose />
			</span>

			<div class="faction-docs_fields">
				<Field title="Имя" :value="state.name" />
				<Field title="Должность" :value="state.rank" />
			</div>
		</div>
	</div>
</template>
