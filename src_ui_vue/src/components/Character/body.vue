<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import Selector from './selector.vue';
	import Slider from './slider.vue';

	const genderList = {
		male: 'Мужской',
		female: 'Женский'
	};
	const names = {
		mother: [
			'Ханна',
			'Ави',
			'Джасмин',
			'Гизель',
			'Амелия',
			'Изабелла',
			'Зоя',
			'Ава',
			'Камила',
			'Виолета',
			'София',
			'Эвелин',
			'Никола',
			'Эшли',
			'Грэйс',
			'Брианна',
			'Наталья',
			'Оливия',
			'Элизабет',
			'Шарлотта',
			'Эмма',
			'Мисти'
		],
		father: [
			'Бенджамин',
			'Даниил',
			'Джошуа',
			'Ноа',
			'Эндрю',
			'Хуан',
			'Алекс',
			'Исаак',
			'Эван',
			'Этан',
			'Винцент',
			'Энджел',
			'Диего',
			'Адриан',
			'Виктор',
			'Максим',
			'Сантиаго',
			'Кевин',
			'Андрей',
			'Самуэль',
			'Антони',
			'Клауд',
			'Нико',
			'Джон'
		]
	};

	const parents = {
		father: [
			0,
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15,
			16,
			17,
			18,
			19,
			20,
			42,
			43,
			44
		],
		mother: [
			21,
			22,
			23,
			24,
			25,
			26,
			27,
			28,
			29,
			30,
			31,
			32,
			33,
			34,
			35,
			36,
			37,
			38,
			39,
			40,
			41,
			45
		]
	};

	const gender = ref<'male' | 'female'>('male');
	const mother = ref(0);
	const father = ref(0);
	const similarity = ref(0.5);
	const skin = ref(6);

	onMounted(() => {
		getSavedState();
	});

	async function getSavedState() {
		const { gender: savedGender, skindata } = await rpc.callClient('CharCreator-GetState');

		gender.value = savedGender;
		mother.value = parents.mother.indexOf(skindata[0]);
		father.value = parents.father.indexOf(skindata[1]);
		similarity.value = skindata[2];
		skin.value = skindata[3];
	}

	function changeAppearance() {
		rpc.callClient('Character-UpdateParents', [
			parents.mother[mother.value],
			parents.father[father.value],
			similarity.value,
			skin.value
		]);
	}

	function switchParent(parent: 'mother' | 'father', value: string) {
		if (parent === 'mother') mother.value = names.mother.indexOf(value);
		else father.value = names.father.indexOf(value);

		changeAppearance();
	}

	function changeSkin(name: 'similarity' | 'skin', value: number) {
		if (name === 'similarity') similarity.value = value;
		else skin.value = value;

		changeAppearance();
	}

	async function toggleGender(value: string) {
		await rpc.callClient('Character-ChangeGender', value);
		await getSavedState();
	}
</script>

<template>
	<div class="character_item character_item--body">
		<Selector
			title="Пол"
			:items="Object.keys(genderList)"
			:value="gender"
			:custom-value="genderList[gender]"
			@change="toggleGender"
		/>

		<Selector
			title="Мать"
			:value="names.mother[mother]"
			:items="names.mother"
			@change="(value) => switchParent('mother', value)"
		/>
		<Selector
			title="Отец"
			:value="names.father[father]"
			:items="names.father"
			@change="(value) => switchParent('father', value)"
		/>

		<Slider
			title="Схожесть"
			:value="similarity"
			:min="0"
			:max="1"
			:step="0.1"
			@change="(value) => changeSkin('similarity', value)"
		/>
		<Slider
			title="Цвет кожи"
			:value="skin"
			:min="0"
			:max="12"
			@change="(value) => changeSkin('skin', value)"
		/>
	</div>
</template>
