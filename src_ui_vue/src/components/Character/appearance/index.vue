<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import Options from '../options.vue';
	import Selector from '../selector.vue';
	import Hair from './hair.vue';
	import Face from './face.vue';
	import Makeup from './makeup.vue';
	import Item from './item.vue';

	const options: { [name: string]: string } = {
		lenses: 'Линзы',
		brows: 'Брови',
		hair: 'Прическа',
		face: 'Лицо'
	};

	const maleOptions = { ...options, beard: 'Борода' };
	const femaleOptions = { ...options, makeup: 'Макияж' };

	const activeOption = ref('hair');
	const gender = ref<'male' | 'female'>('male');
	const hair = ref({
		style: 0,
		color: 0,
		highlight: 0
	});
	const headOverlay = ref<[number, number][]>([
		[-1, 0],
		[-1, 0],
		[-1, 0],
		[-1, 0],
		[-1, 0],
		[-1, 0],
		[-1, 0],
		[-1, 0],
		[-1, 0],
		[-1, 0],
		[-1, 0],
		[-1, 0]
	]);
	const eyeColor = ref(0);

	onMounted(() => {
		rpc
			.callClient('CharCreator-GetState')
			.then(
				({
					gender: nextGender,
					hair: nextHair,
					headOverlay: nextOverlay,
					eyeColor: nextEyeColor
				}: any) => {
					gender.value = nextGender;
					hair.value = nextHair;
					headOverlay.value = nextOverlay;
					eyeColor.value = nextEyeColor;
				}
			);
	});

	function selectOption(name: string) {
		activeOption.value = name;
	}

	async function changeHeadOverlay(id: number, value: number, color = 0) {
		headOverlay.value = headOverlay.value.map(
			(item, index): [number, number] => (id === index ? [value, color] : item)
		);

		await rpc.callClient('Character-UpdateHeadOverlay', [id, value, color]);
	}

	async function setEyeColor(color: number) {
		eyeColor.value = color;

		await rpc.callClient('Character-SetEyeColor', color);
	}

	async function setHair(prop: string, value: number) {
		(hair.value as any)[prop] = value;

		const { style, color, highlight } = hair.value;

		await rpc.callClient('Character-UpdateHair', [style, color, highlight]);
	}
</script>

<template>
	<div class="character_item character_item--appearance">
		<Hair
			v-if="activeOption === 'hair'"
			:style="hair.style"
			:color="hair.color"
			:highlight="hair.highlight"
			:update="setHair"
		/>

		<Face
			v-else-if="activeOption === 'face'"
			:values="headOverlay"
			:update="changeHeadOverlay"
		/>

		<Item
			v-else-if="activeOption === 'beard'"
			:style="headOverlay[1][0]"
			:color="headOverlay[1][1]"
			:styles="28"
			:update="(style, color) => changeHeadOverlay(1, style, color)"
		/>

		<Item
			v-else-if="activeOption === 'brows'"
			:style="headOverlay[2][0]"
			:color="headOverlay[2][1]"
			:styles="33"
			:update="(style, color) => changeHeadOverlay(2, style, color)"
		/>

		<Makeup
			v-else-if="activeOption === 'makeup'"
			:values="headOverlay"
			:update="changeHeadOverlay"
		/>

		<Selector
			v-else
			title="Цвет"
			:items="[...Array(31).keys()]"
			:value="eyeColor"
			@change="setEyeColor"
		/>

		<Options
			:items="gender === 'male' ? maleOptions : femaleOptions"
			:selected="activeOption"
			:select="selectOption"
		/>
	</div>
</template>
