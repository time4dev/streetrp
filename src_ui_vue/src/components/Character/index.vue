<script setup lang="ts">
	import { ref } from 'vue';
	import rpc from '@/utils/rpc';
	import { useRotation } from '@/composables/use-rotation';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Hint from '@/components/Common/hint.vue';
	import Page from './page.vue';
	import Body from './body.vue';
	import Face from './face.vue';
	import Appearance from './appearance/index.vue';
	import Clothes from './clothes.vue';

	// Legacy: `export default withRotation(Character)`
	useRotation();

	const pages: { [name: string]: string } = {
		body: 'Персонаж',
		face: 'Черты лица',
		appearance: 'Внешность',
		clothes: 'Одежда'
	};

	const activePage = ref('body');

	function openPage(name: string) {
		rpc.callClient('CharCreator-ChangeCamera', name);

		activePage.value = name;
	}

	function switchPage(increase: boolean) {
		const items = Object.keys(pages);
		const pageIndex = items.indexOf(activePage.value);

		if (increase && pageIndex === items.length - 1) return create();

		openPage(increase ? items[pageIndex + 1] : items[pageIndex - 1]);
	}

	function create() {
		rpc.callClient('CharCreator-Submit');
	}
</script>

<template>
	<div class="character">
		<Page :items="pages" :current="activePage" :open="openPage" />

		<div class="character_container">
			<button
				class="character_btn"
				:disabled="Object.keys(pages)[0] === activePage"
				@click="switchPage(false)"
			>
				Назад
			</button>

			<Body v-if="activePage === 'body'" />

			<Face v-else-if="activePage === 'face'" />

			<Clothes v-else-if="activePage === 'clothes'" />

			<Appearance v-else />

			<GradientButton @click="switchPage(true)">Далее</GradientButton>
		</div>

		<Hint className="character_hint" action="drag">Поворот персонажа</Hint>
	</div>
</template>
