<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import Cell from './cell.vue';

	type Action = {
		title: string;
		icon?: string;
	};

	const actionList: { [name: string]: Action } = {
		invite: {
			title: 'Пригласить в организацию',
			icon: 'handshake'
		},
		docs: {
			title: 'Показать удостоверение'
		},
		cuff: {
			title: 'Надеть наручники',
			icon: 'handcuffs'
		},
		uncuff: {
			title: 'Снять наручники',
			icon: 'handcuffs'
		},
		tie: {
			title: 'Использовать стяжки',
			icon: 'cable_tie'
		},
		untie: {
			title: 'Разрезать стяжки',
			icon: 'cable_tie'
		},
		follow: {
			title: 'Тащить за собой',
			icon: 'detain'
		},
		unfollow: {
			title: 'Отпустить',
			icon: 'detain'
		},
		headsack_enable: {
			title: 'Надеть мешок',
			icon: 'sack'
		},
		headsack_disable: {
			title: 'Снять мешок',
			icon: 'sack'
		},
		unmask: {
			title: 'Сорвать маску',
			icon: 'mask'
		},
		frisk: {
			title: 'Обыскать',
			icon: 'backpack'
		},
		vehicle: {
			title: 'Посадить в ТС'
		},
		heal: {
			title: 'Предложить лечение',
			icon: 'pill'
		},
		reanimate: {
			title: 'Реанимировать'
		},
		medcard_physical: {
			title: 'Выдать справку о физ. здоровье',
			icon: 'medcard'
		},
		medcard_mental: {
			title: 'Выдать справку о псих. здоровье',
			icon: 'medcard'
		},
		military_id: {
			title: 'Выдать военный билет',
			icon: 'licenses'
		}
	};

	const actions = ref<string[]>([]);

	onMounted(() => {
		rpc.callClient('FactionActions-GetItems').then((data: string[]) => (actions.value = data));
	});

	function callAction(action: string) {
		rpc.callClient('FactionActions-Call', action);
	}
</script>

<template>
	<Cell
		v-for="item in actions"
		:key="item"
		:label="actionList[item].icon ?? item"
		:title="actionList[item].title"
		@click="callAction(item)"
	/>
</template>
