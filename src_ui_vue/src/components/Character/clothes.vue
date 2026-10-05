<script setup lang="ts">
	import { computed, onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import Selector from '@/components/Common/selector.vue';
	import Options from './options.vue';

	const options: { [name: string]: string } = {
		shirts: 'Футболка',
		pants: 'Брюки',
		shoes: 'Обувь'
	};

	type State = {
		activeOption: string;

		pants: number;
		shoes: number;
		shirts: number;
	};

	const state = reactive<State>({
		activeOption: 'shirts',

		shirts: 0,
		pants: 0,
		shoes: 0
	});

	// Same dynamic access as the legacy `(this.state as any)[activeOption]`
	const activeValue = computed(() => (state as any)[state.activeOption]);

	onMounted(() => {
		rpc
			.callClient('CharCreator-GetState')
			.then(({ shirts, pants, shoes }: State) => {
				state.shirts = shirts;
				state.pants = pants;
				state.shoes = shoes;
			});
	});

	function selectOption(name: string) {
		state.activeOption = name;
	}

	function setClothes() {
		const { activeOption } = state;

		rpc.callClient('Character-SetClothes', [activeOption, (state as any)[activeOption]]);
	}

	function switchOption(option: string, value: number) {
		(state as any)[option] = value;

		setClothes();
	}
</script>

<template>
	<div class="character_item character_item--appearance">
		<Selector
			className="character_selector"
			circle-button
			:title="options[state.activeOption]"
			:items="[...Array(4).keys()]"
			:value="activeValue"
			@change="(value) => switchOption(state.activeOption, value)"
		/>

		<Options :items="options" :selected="state.activeOption" :select="selectOption" />
	</div>
</template>
