<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import Selector from '@/components/Common/selector.vue';

	const items = {
		exit: 'Место выхода',
		house: 'Ваш дом',
		org: 'Организация',
		start: 'Аэропорт'
	};

	type State = {
		jail: boolean;
		houses: number[];
		selectedHouse: number;
	} & { [K in keyof typeof items]: boolean };

	const state = reactive<State>({
		jail: false,
		houses: [],
		selectedHouse: 0,
		exit: true,
		house: false,
		start: false,
		org: false
	});

	// Legacy: componentDidMount -> setState(location.state)
	onMounted(() => {
		const routeState = history.state as Partial<State> | undefined;

		if (!routeState) return;

		for (const key of Object.keys(state) as (keyof State)[]) {
			if (routeState[key] !== undefined) (state as any)[key] = routeState[key];
		}
	});

	function selectSpawn(type: string) {
		rpc.callServer('Spawn-SelectType', [type, state.houses[state.selectedHouse]]);
		rpc.callClient('Browser-HidePage');
	}

	function selectHouse(house: number) {
		state.selectedHouse = state.houses.indexOf(house);
	}

	// Legacy inline classNames condition: (jail && name !== 'exit') || !state[name]
	function isDisabled(name: string) {
		return (state.jail && name !== 'exit') || !(state as any)[name];
	}
</script>

<template>
	<div class="spawn">
		<div
			v-for="(title, name) in items"
			:key="name"
			:class="['spawn_item', `spawn_item--${name}`, { disabled: isDisabled(name) }]"
		>
			<PrimaryTitle className="spawn_title">{{ title }}</PrimaryTitle>

			<Selector
				v-if="name === 'house'"
				className="spawn_selector"
				title="Выберите в каком появиться"
				circle-button
				:items="state.houses"
				:value="state.houses[state.selectedHouse]"
				@change="selectHouse"
			/>

			<OutlineButton className="spawn_submit" @click="selectSpawn(name)">
				Войти
			</OutlineButton>
		</div>
	</div>
</template>
