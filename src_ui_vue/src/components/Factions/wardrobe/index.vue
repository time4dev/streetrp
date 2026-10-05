<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import { useRotation } from '@/composables/use-rotation';
	import Selector from '@/components/Common/selector.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Hint from '@/components/Common/hint.vue';
	import Categories from './categories.vue';

	type State = {
		activeCategory: string;
		items: number;
		currentItem: number;
		onDuty: boolean;
	};

	const state = reactive<State>({
		activeCategory: 'hat',
		items: 0,
		currentItem: 0,
		onDuty: false
	});

	// Legacy: export default withRotation(FactionWardrobe)
	useRotation();

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);

		// Legacy: componentDidMount read this.state.activeCategory right after a mount-time
		// setState(location.state) — React 16 had not applied it yet, so it always was 'hat'
		setCategory('hat');
	});

	async function setCategory(name: string) {
		const amount: number = await rpc.callClient('FactionWardrobe-ChangeType', name);

		state.activeCategory = name;
		state.items = amount;
		state.currentItem = 0;
	}

	async function changeItem(index: number) {
		state.currentItem = index;

		await rpc.callClient('FactionWardrobe-ChangeItem', index);
	}

	async function startWork() {
		await rpc.callServer('Factions-StartWork');
		state.onDuty = true;
	}

	async function finishWork() {
		if (!state.onDuty) return;

		await rpc.callServer('Factions-FinishWork');
		state.onDuty = false;
	}
</script>

<template>
	<div class="faction-wardrobe">
		<Hint class-name="faction-wardrobe_hint" action="drag">Поворот персонажа</Hint>

		<div class="faction-wardrobe_container">
			<Categories :current="state.activeCategory" @set-category="setCategory" />

			<div class="faction-wardrobe_main">
				<Selector
					class-name="faction-wardrobe_selector"
					:value="state.currentItem"
					:items="[...Array(state.items).keys()]"
					@change="changeItem"
				/>
			</div>
		</div>

		<div class="faction-wardrobe_buttons">
			<GradientButton v-if="state.onDuty" color="purple" @click="finishWork">
				Закончить смену
			</GradientButton>
			<GradientButton v-else @click="startWork">Начать смену</GradientButton>

			<OutlineButton @click="rpc.callClient('FactionWardrobe-CloseMenu')">Закрыть</OutlineButton>
		</div>
	</div>
</template>
