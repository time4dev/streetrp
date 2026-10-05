<script setup lang="ts">
	import { computed, onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import Slider from './slider.vue';
	import Options from './options.vue';

	const options: { [name: string]: string } = {
		nose: 'Нос',
		brows: 'Брови',
		cheeks: 'Щеки',
		eyes: 'Глаза',
		lips: 'Губы',
		jaw: 'Челюсть',
		chin: 'Подбородок'
	};

	const items: { [name: string]: string[] } = {
		nose: [
			'Ширина носа',
			'Высота носа',
			'Длина кончика носа',
			'Глубина моста носа',
			'Высота кончика носа',
			'Смещение носа'
		],
		brows: ['Высота бровей', 'Ширина бровей'],
		cheeks: ['Высота скул', 'Ширина скул', 'Ширина щек'],
		eyes: ['Размер глаз'],
		lips: ['Толщина губ'],
		jaw: ['Ширина челюсти', 'Форма челюсти'],
		chin: [
			'Высота подбородка',
			'Глубина подбородка',
			'Ширина подбородка',
			'Толщина подбородка',
			'Толщина шеи'
		]
	};

	const activeOption = ref('nose');
	const facedata = ref<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

	onMounted(() => {
		rpc.callClient('CharCreator-GetState').then((data) => {
			facedata.value = data.facedata;
		});
	});

	async function changeFaceData(prop: number, value: number) {
		facedata.value = facedata.value.map((item, index) => (prop === index ? value : item));

		rpc.callClient('Character-UpdateFaceOptions', [prop, value]);
	}

	function selectOption(name: string) {
		activeOption.value = name;
	}

	function getStartIndex(option: string) {
		let index = 0;

		Object.entries(items).every(([name, list]) => {
			if (option === name) return false;

			index += list.length;

			return true;
		});

		return index;
	}

	const startIndex = computed(() => getStartIndex(activeOption.value));
</script>

<template>
	<div class="character_item character_item--face">
		<Slider
			v-for="(item, index) in items[activeOption]"
			:key="item"
			:title="item"
			:value="facedata[startIndex + index]"
			:step="0.1"
			:min="-1"
			:max="1.0"
			@change="(value) => changeFaceData(startIndex + index, value)"
		/>

		<Options :items="options" :selected="activeOption" :select="selectOption" />
	</div>
</template>
